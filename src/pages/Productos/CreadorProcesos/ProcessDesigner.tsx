// ProcessDesigner.tsx
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
import "@xyflow/react/dist/style.css";
import MaterialPrimarioNode from "./Nodos/MaterialPrimarioNode";
import ProcesoNode from "./Nodos/ProcesoNode";
import { ProcesoNodeData } from "./types";
import {ProductoSemiter} from "../types.tsx";
import TargetNode from "./Nodos/TargetNode";
import EditProcesoNodeDialog from "./EditProcesoNodeDialog";

const nodeTypes = {
    materialPrimarioNode: MaterialPrimarioNode,
    procesoNode: ProcesoNode,
    targetNode: TargetNode,
};

interface Props {
    semioter2: ProductoSemiter;
}

export default function ProcessDesigner({ semioter2 }: Props) {
    // Create nodes for each material (insumo) from ProductoSemiter.
    // Use a fallback empty array if insumos is undefined.
    const getMatPrimasNodes = (semi: ProductoSemiter): Node[] =>
        (semi.insumos || []).map((insumo, index) => ({
            id: `mp-${insumo.producto.productoId}`, // unique id for each node
            data: {
                label: insumo.producto.nombre,
                tipo_unidad: insumo.producto.tipoUnidades,
                cantidad: insumo.cantidadRequerida,
            },
            position: { x: 50, y: index * 200 },
            type: "materialPrimarioNode",
        }));

    // Create the target node using ProductoSemiter information.
    const getTargetNode = (semi: ProductoSemiter): Node => ({
        id: "tg",
        data: {
            label: semi.nombre,
            tipo_unidad: semi.tipoUnidades,
            tipo_producto: semi.tipo_producto,
        },
        position: { x: 500, y: 210 },
        type: "targetNode",
    });

    // Initial nodes are the material nodes plus the target node.
    const initialNodes: Node[] = [...getMatPrimasNodes(semioter2), getTargetNode(semioter2)];
    const initialEdges: Edge[] = [];

    const zeroProcesoNode = {
        id: "0",
        data: {
            label: "Node 0",
            unidadesTiempo: "",
            tiempo: "",
            nombreProceso: "",
            instrucciones: "",
            descripcionSalida: "",
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

    // Validate connection rules.
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

            return false;
        },
        [nodes, edges]
    );

    const agregarProcesoOnClick = () => {
        const nextId = String(Number(lastNode.id) + 1);
        const nextNode = {
            id: nextId,
            data: {
                label: `Node ${nextId}`,
                unidadesTiempo: "",
                tiempo: "",
                nombreProceso: "",
                instrucciones: "",
                descripcionSalida: "",
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
        if (selectedElement && selectedElement.id === id) setSelectedElement(null);
    };

    const deleteEdgeById = (id: string) => {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
        if (selectedElement && selectedElement.id === id) setSelectedElement(null);
    };

    // Remove all process nodes and reset edges.
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
                    if ("data" in selectedElement && (selectedElement as Node).type === "procesoNode") {
                        deleteNodeById(selectedElement.id);
                    } else if (!("data" in selectedElement)) {
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

                <Button variant="solid" colorScheme="red" onClick={removeAllProcessNodes}>
                    Reset
                </Button>

                <Button
                    variant="solid"
                    colorScheme="red"
                    onClick={() => {
                        if (selectedElement) {
                            if ("data" in selectedElement && (selectedElement as Node).type === "procesoNode") {
                                deleteNodeById(selectedElement.id);
                            } else if (!("data" in selectedElement)) {
                                deleteEdgeById(selectedElement.id);
                            }
                        }
                    }}
                    isDisabled={
                        !selectedElement ||
                        (("data" in selectedElement) && (selectedElement as Node).type !== "procesoNode")
                    }
                >
                    Eliminar Seleccion
                </Button>

                <Button
                    variant="solid"
                    colorScheme="blue"
                    isDisabled={
                        !selectedElement ||
                        (("data" in selectedElement) && (selectedElement as Node).type !== "procesoNode")
                    }
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
