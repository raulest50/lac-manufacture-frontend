import { useCallback, useEffect, useState, useRef } from "react";
import {Box, Flex, Button, Heading, Divider, Center} from "@chakra-ui/react";
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
    ConnectionMode,
    ReactFlowProvider,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MaterialPrimarioNode from "./Nodos/MaterialPrimarioNode.tsx";
import ProcesoNode from "./Nodos/ProcesoNode.tsx";
import { ProductoSemiter, ProcesoProduccionEntity, ProcesoDiseñado, ProcesoProduccionNode, TimeModelType } from "../../types.tsx";
import TargetNode from "./Nodos/TargetNode.tsx";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/icons";
// Importar el ProcesoProduccionPicker
import { ProcesoProduccionPicker } from "./components/ProcesoProduccionPicker/ProcesoProduccionPicker.tsx";


const nodeTypes = {
    materialPrimarioNode: MaterialPrimarioNode,
    procesoNode: ProcesoNode,
    targetNode: TargetNode,
};

interface Props {
    semioter2: ProductoSemiter;
    onProcessChange?: (proceso: ProcesoDiseñado) => void;
    onValidityChange?: (isValid: boolean) => void;
}

function ProcessDesignerContent({ semioter2, onProcessChange, onValidityChange }: Props) {
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

    // Opciones predeterminadas para los edges (conexiones)
    const defaultEdgeOptions = {
        style: { 
            strokeWidth: 3,        // Aumentar el grosor (valor anterior: 1)
            stroke: '#333333',     // Color más oscuro (anterior: #b1b1b7)
        },
        animated: true,            // Mantener la animación para mejor visibilidad
    };

    //const toast = useToast();

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

    const boxRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { fitView } = useReactFlow();

    // Track the selected element (node or edge) from React Flow.
    const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);

    // Estado para controlar el modal del picker de procesos
    const [isProcesoPickerOpen, setIsProcesoPickerOpen] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    useEffect(() => {
        const procesos: ProcesoProduccionNode[] = nodes.map((n) => ({
            id: n.id,
            data: n.data,
            type: n.type,
            targetIds: edges.filter((e) => e.source === n.id).map((e) => e.target),
        }));
        const proceso: ProcesoDiseñado = { procesosProduccion: procesos };
        onProcessChange?.(proceso);
    }, [nodes, edges, onProcessChange]);

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

    // Modificar para abrir el picker en lugar de crear un nodo directamente
    const agregarProcesoOnClick = () => {
        setIsProcesoPickerOpen(true);
    };

    const toggleFullScreen = () => {
        const element = boxRef.current;
        if (!element) return;
        if (isFullScreen) {
            document.exitFullscreen?.();
        } else {
            element.requestFullscreen?.();
        }
        setIsFullScreen((prev) => !prev);
    };

    useEffect(() => {
        fitView();
    }, [isFullScreen, fitView]);

    // Función para manejar los procesos seleccionados del picker
    const handleProcessSelection = (procesos: ProcesoProduccionEntity[]) => {
        const newNodes = procesos.map((proceso, index) => {
            const nextId = String(Number(lastNode.id) + index + 1);
            return {
                id: nextId,
                data: {
                    label: proceso.nombre,
                    unidadesTiempo: "1", // Default value
                    setupTime: String(proceso.setUpTime), // Add setup time
                    nombreProceso: proceso.nombre,
                    instrucciones: "", // Este campo podría venir del backend en el futuro
                    descripcionSalida: "",
                    procesoId: proceso.procesoId, // Guardar el ID del proceso seleccionado

                    // Nuevos campos para el modelo de tiempo
                    model: proceso.model,
                    constantSeconds: proceso.constantSeconds,
                    throughputUnitsPerSec: proceso.throughputUnitsPerSec,
                    secondsPerUnit: proceso.secondsPerUnit,
                    secondsPerBatch: proceso.secondsPerBatch,
                    batchSize: proceso.batchSize,

                },
                position: { 
                    x: 200, 
                    y: lastNode.position.y + (50 * (index + 1)) 
                },
                type: "procesoNode",
            };
        });

        if (newNodes.length > 0) {
            setNodes([...nodes, ...newNodes]);
            setLastNode(newNodes[newNodes.length - 1]);
        }
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

    // --- New: Compute process validity without showing toast ---
    const computeValidity = (nodes: Node[], edges: Edge[]): boolean => {
        // Raw-material nodes must have at least one outgoing edge.
        const materialNodes = nodes.filter((node) => node.type === "materialPrimarioNode");
        for (const node of materialNodes) {
            if (!edges.some((edge) => edge.source === node.id)) {
                return false;
            }
        }

        // Process nodes must have at least one incoming and exactly one outgoing edge.
        const processNodes = nodes.filter((node) => node.type === "procesoNode");
        for (const node of processNodes) {
            const incoming = edges.filter((edge) => edge.target === node.id).length;
            const outgoing = edges.filter((edge) => edge.source === node.id).length;
            if (incoming < 1 || outgoing !== 1) {
                return false;
            }
        }

        // Target nodes must have at least one incoming edge.
        const targetNodes = nodes.filter((node) => node.type === "targetNode");
        for (const node of targetNodes) {
            if (!edges.some((edge) => edge.target === node.id)) {
                return false;
            }
        }

        return true;
    };

    // --- New: useEffect to call onValidityChange whenever nodes or edges change ---
    useEffect(() => {
        if (onValidityChange) {
            const valid = computeValidity(nodes, edges);
            onValidityChange(valid);
        }
    }, [nodes, edges, onValidityChange]);

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

            <Box
                w="fill"
                ref={boxRef}
                style={
                    isFullScreen
                        ? {
                              width: "100vw",
                              height: "100vh",
                              position: "fixed",
                              top: 0,
                              left: 0,
                              zIndex: 9999,
                              border: "1px solid black",
                          }
                        : { height: "50vh", border: "1px solid black" }
                }
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionMode={ConnectionMode.Loose}
                    connectOnClick
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
            <Flex direction="row" gap={5} alignItems={"center"}>
                <Button variant="solid" colorScheme="teal" onClick={agregarProcesoOnClick}>
                    Agregar Proceso
                </Button>

                <Button variant="solid" onClick={toggleFullScreen}>
                    {isFullScreen ? "Salir" : "Pantalla completa"}
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

                <Center height="50px">
                    <Divider orientation="vertical" />
                </Center>

                <Stat backgroundColor={"gray.50"} p={"1em"} boxShadow={"md"} w={"full"}>
                    <StatLabel>Total Costo Insumos: </StatLabel>
                    <StatNumber>{semioter2.costo} ( $ COP)</StatNumber>
                </Stat>
            </Flex>
            {/* Agregar el componente ProcesoProduccionPicker */}
            <ProcesoProduccionPicker
                isOpen={isProcesoPickerOpen}
                onClose={() => setIsProcesoPickerOpen(false)}
                onConfirm={handleProcessSelection}
                alreadySelected={[]}
            />
        </Flex>
    );
}

export default function ProcessDesigner(props: Props) {
    return (
        <ReactFlowProvider>
            <ProcessDesignerContent {...props} />
        </ReactFlowProvider>
    );
}
