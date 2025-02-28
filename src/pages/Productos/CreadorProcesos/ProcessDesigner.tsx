import { useCallback, useEffect, useState } from "react";
import { Box, Flex, Button, Heading, Divider } from "@chakra-ui/react";
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    MiniMap,
    BackgroundVariant,
    Background,
    useNodesState,
    useEdgesState,
    Connection,
    addEdge,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import MaterialPrimarioNode from "./Nodos/MaterialPrimarioNode.tsx";
import ProcesoNode from "./Nodos/ProcesoNode.tsx";
import {ProcesoNodeData, Target} from "./types.tsx";
import TargetNode from "./Nodos/TargetNode.tsx";
import EditProcesoNodeDialog from "./EditProcesoNodeDialog";

const nodeTypes = {
    materialPrimarioNode: MaterialPrimarioNode,
    procesoNode: ProcesoNode,
    targetNode: TargetNode,
};

interface Props {
    target: Target;
}

export default function ProcessDesigner({ target }: Props) {
    // Create nodes for each material (insumo)
    const getMatPrimasNodes = (target: Target): Node[] =>
        target.insumos.map((insumo, index) => ({
            id: `mp-${insumo.producto.productoId}`, // unique id for each node
            data: {
                label: insumo.producto.nombre,
                tipo_unidad: insumo.producto.tipoUnidades,
                cantidad: insumo.cantidadRequerida,
            },
            position: { x: 50, y: index * 200 },
            type: "materialPrimarioNode",
        }));

    // Create the target node
    const getTargetNode = (target: Target): Node => ({
        id: "tg",
        data: {
            label: target.nombre,
            tipo_unidad: target.tipoUnidades,
            tipo_producto: target.tipo_producto,
        },
        position: { x: 500, y: 210 },
        type: "targetNode",
    });

    const initialNodes: Node[] = [...getMatPrimasNodes(target), getTargetNode(target)];
    const initialEdges: Edge[] = [];

    const zeroProcesoNode = {
        id: "0",
        data: {
            label: "Node 0",
            unidadesTiempo:"",
            tiempo: "",
            nombreProceso:"",
            instrucciones:"",
        },
        position: { x: 200, y: 0 },
        type: "procesoNode",
    };

    const [lastNode, setLastNode] = useState<Node>(zeroProcesoNode);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Track the selected element (node or edge) from React Flow.
    const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);

    // State to control the edit dialog.
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // Connection validation function.
    // Rules:
    // • From materialPrimarioNode: valid only if target is procesoNode AND the source has no existing outgoing edge.
    // • From procesoNode: valid only if target is procesoNode or targetNode, and only if the source has no outgoing edge.
    const isValidConnection = useCallback(
        (connection: Connection | Edge): boolean => {
            const conn = connection as Connection; // assume it's a Connection
            const sourceNode = nodes.find((n) => n.id === conn.source);
            const targetNode = nodes.find((n) => n.id === conn.target);
            if (!sourceNode || !targetNode) return false;

            if (sourceNode.type === "materialPrimarioNode") {
                const hasOutput = edges.some((edge) => edge.source === sourceNode.id);
                if (hasOutput) return false;
                return targetNode.type === "procesoNode";
            }

            if (sourceNode.type === "procesoNode") {
                const hasOutput = edges.some((edge) => edge.source === sourceNode.id);
                if (hasOutput) return false;
                return targetNode.type === "procesoNode" || targetNode.type === "targetNode";
            }

            // Other cases (e.g. starting from a target node) are invalid.
            return false;
        },
        [nodes, edges]
    );

    const agregarProcesoOnClick = () => {
        const nextNode = {
            id: String(Number(lastNode.id) + 1),
            data: {
                label: `Node ${String(Number(lastNode.id) + 1)}`,
                unidadesTiempo:"",
                tiempo: "",
                nombreProceso:"",
                instrucciones:"",
            },
            position: { x: 200, y: lastNode.position.y + 50 },
            type: "procesoNode",
        };
        setNodes([...nodes, nextNode]);
        setLastNode(nextNode);
    };

    const deleteNodeById = (id: string) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        setEdges((prevEdges) =>
            prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
        );
        if ("id" in (selectedElement || {}) && selectedElement?.id === id)
            setSelectedElement(null);
    };

    const deleteEdgeById = (id: string) => {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
        if ("id" in (selectedElement || {}) && selectedElement?.id === id)
            setSelectedElement(null);
    };

    // Remove all process nodes and reset edges to initial state.
    const removeAllProcessNodes = () => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setLastNode(zeroProcesoNode);
        setSelectedElement(null);
    };

    // Listen for Delete key events to remove the selected element.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete" || event.key === "Supr") {
                if (selectedElement) {
                    // If selected element is a node and it's a process node.
                    if ("data" in selectedElement && (selectedElement as Node).type === "procesoNode") {
                        deleteNodeById(selectedElement.id);
                    }
                    // If selected element is an edge.
                    else if (!("data" in selectedElement)) {
                        deleteEdgeById(selectedElement.id);
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedElement]);

    return (
        <Flex direction="column" gap={8} p="1em">
            <Flex direction="row">
                <Heading flex={2} as="h2" size="lg" fontFamily="Comfortaa Variable">
                    Process Designer
                </Heading>
            </Flex>

            <Divider />

            <Box w="fill" style={{ height: "50vh", border: "1px solid black" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    // Use onSelectionChange to update our selected element state.
                    onSelectionChange={({ nodes: selectedNodes, edges: selectedEdges }) => {
                        if (selectedNodes.length > 0) setSelectedElement(selectedNodes[0]);
                        else if (selectedEdges.length > 0) setSelectedElement(selectedEdges[0]);
                        else setSelectedElement(null);
                    }}
                    isValidConnection={isValidConnection}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
                </ReactFlow>
            </Box>
            <Flex direction="row" gap={5}>
                <Button variant="solid" colorScheme="teal" onClick={agregarProcesoOnClick}>
                    Agregar Proceso
                </Button>

                <Button
                    variant="solid"
                    colorScheme="red"
                    onClick={removeAllProcessNodes}
                >
                    Reset
                </Button>

                {/* Delete Selection button: works for a process node or an edge */}
                <Button
                    variant="solid"
                    colorScheme="red"
                    onClick={() => {
                        if (selectedElement) {
                            // If it's a node and is a process node.
                            if ("data" in selectedElement && (selectedElement as Node).type === "procesoNode") {
                                deleteNodeById(selectedElement.id);
                            }
                            // Else, if it's an edge.
                            else if (!("data" in selectedElement)) {
                                deleteEdgeById(selectedElement.id);
                            }
                        }
                    }}
                    isDisabled={!selectedElement ||
                        (("data" in selectedElement) && (selectedElement as Node).type !== "procesoNode")}
                >
                    Eliminar Seleccion
                </Button>

                <Button
                    variant="solid"
                    colorScheme="blue"
                    isDisabled={!selectedElement || (("data" in selectedElement) && (selectedElement as Node).type !== "procesoNode")}
                    onClick={() => {
                        if (
                            selectedElement &&
                            "data" in selectedElement &&
                            (selectedElement as Node).type === "procesoNode"
                        ) {
                            setIsEditDialogOpen(true);
                        }
                    }}
                >
                    Editar
                </Button>
            </Flex>

            {isEditDialogOpen &&
                selectedElement &&
                "data" in selectedElement &&
                (selectedElement as Node).type === "procesoNode" && (
                    <EditProcesoNodeDialog<ProcesoNodeData>
                        isOpen={isEditDialogOpen}
                        onClose={() => setIsEditDialogOpen(false)}
                        nodeData={(selectedElement as Node<ProcesoNodeData>).data}
                        onSave={(newData) => {
                            // Update the selected process node with the new data.
                            setNodes((prevNodes) =>
                                prevNodes.map((node) => {
                                    if (node.id === selectedElement.id) {
                                        return { ...node, data: { ...node.data, ...newData } };
                                    }
                                    return node;
                                })
                            );
                        }}
                    />
                )}

        </Flex>
    );
}
