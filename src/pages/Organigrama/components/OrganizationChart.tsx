import { useCallback, useEffect, useState } from "react";
import { Box, Flex, Button, Heading, Divider, useToast } from "@chakra-ui/react";
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
import PositionNode from "./PositionNode";
import { Position, PositionNodeData, AccessLevel } from "../types";
import EditPositionDialog from "./EditPositionDialog";
import axios from "axios";
// Import mock API responses
import { mockApiResponses } from "../prototype_data";

const nodeTypes = {
  positionNode: PositionNode,
};

interface Props {
  accessLevel: AccessLevel;
  organizationChartId: string;
  onNavigateToDetails: (positionId: string) => void;
}

export default function OrganizationChart({ 
  accessLevel, 
  organizationChartId,
  onNavigateToDetails 
}: Props) {
  const toast = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convertir posiciones a nodos para React Flow
  const createNodesFromPositions = (positions: Position[]): Node[] => {
    return positions.map((position, index) => ({
      id: position.id,
      data: {
        id: position.id,
        title: position.title,
        department: position.department,
        description: position.description,
        level: position.level,
      } as PositionNodeData,
      position: { 
        x: 250 * (position.level || 1), 
        y: index * 150 
      },
      type: "positionNode",
    }));
  };

  // Crear conexiones entre nodos basadas en la relación reportTo
  const createEdgesFromPositions = (positions: Position[]): Edge[] => {
    return positions
      .filter(position => position.reportTo)
      .map(position => ({
        id: `e-${position.reportTo}-${position.id}`,
        source: position.reportTo!,
        target: position.id,
        type: 'smoothstep',
      }));
  };

  // Cargar datos del organigrama
  useEffect(() => {
    const fetchOrganizationChart = async () => {
      try {
        setIsLoading(true);
        // Usar mock API en lugar de axios
        const response = await mockApiResponses.getOrganizationChart(organizationChartId);
        setPositions(response.data.positions || []);
      } catch (error) {
        toast({
          title: "Error al cargar el organigrama",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationChart();
  }, [organizationChartId, toast]);

  const initialNodes = createNodesFromPositions(positions);
  const initialEdges = createEdgesFromPositions(positions);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Actualizar nodos y conexiones cuando cambian las posiciones
  useEffect(() => {
    setNodes(createNodesFromPositions(positions));
    setEdges(createEdgesFromPositions(positions));
  }, [positions, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Solo permitir conexiones si el usuario tiene nivel de acceso de edición
      if (accessLevel === AccessLevel.EDIT) {
        setEdges((eds) => addEdge(params, eds));

        // Actualizar la relación reportTo en el backend
        const sourceId = params.source;
        const targetId = params.target;

        if (sourceId && targetId) {
          updatePositionReportTo(targetId, sourceId);
        }
      }
    },
    [accessLevel, setEdges]
  );

  // Actualizar la relación reportTo de una posición
  const updatePositionReportTo = async (positionId: string, reportToId: string) => {
    try {
      // Usar mock API en lugar de axios
      await mockApiResponses.updatePosition(positionId, {
        reportTo: reportToId
      });

      // Actualizar el estado local
      setPositions(prevPositions => 
        prevPositions.map(pos => 
          pos.id === positionId ? { ...pos, reportTo: reportToId } : pos
        )
      );
    } catch (error) {
      toast({
        title: "Error al actualizar la relación jerárquica",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Agregar una nueva posición
  const addNewPosition = () => {
    if (accessLevel !== AccessLevel.EDIT) return;

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      title: "Nuevo Cargo",
      department: "Departamento",
      description: "Descripción del cargo",
      level: 1,
    };

    // Crear el nodo para la nueva posición
    const newNode: Node = {
      id: newPosition.id,
      data: {
        id: newPosition.id,
        title: newPosition.title,
        department: newPosition.department,
        description: newPosition.description,
        level: newPosition.level,
      } as PositionNodeData,
      position: { x: 100, y: nodes.length * 150 },
      type: "positionNode",
    };

    // Guardar la nueva posición en el backend
    saveNewPosition(newPosition, newNode);
  };

  // Guardar una nueva posición en el backend
  const saveNewPosition = async (position: Position, node: Node) => {
    try {
      // Usar mock API en lugar de axios
      const response = await mockApiResponses.createPosition(position);
      const savedPosition = response.data;

      // Actualizar el estado local con la posición guardada
      setPositions(prevPositions => [...prevPositions, savedPosition]);
      setNodes(prevNodes => [...prevNodes, { ...node, id: savedPosition.id }]);

      toast({
        title: "Posición creada correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error al crear la posición",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Eliminar una posición
  const deletePosition = async (positionId: string) => {
    if (accessLevel !== AccessLevel.EDIT) return;

    try {
      // Usar mock API en lugar de axios
      await mockApiResponses.deletePosition(positionId);

      // Actualizar el estado local
      setPositions(prevPositions => prevPositions.filter(pos => pos.id !== positionId));
      setNodes(prevNodes => prevNodes.filter(node => node.id !== positionId));
      setEdges(prevEdges => 
        prevEdges.filter(edge => edge.source !== positionId && edge.target !== positionId)
      );

      toast({
        title: "Posición eliminada correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error al eliminar la posición",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Manejar la selección de nodos
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  // Navegar a la página de detalles de la posición
  const navigateToPositionDetails = () => {
    if (selectedNode) {
      onNavigateToDetails(selectedNode.id);
    }
  };

  return (
    <Flex direction="column" gap={8} p="1em">
      <Flex direction="row">
        <Heading flex={2} as="h2" size="lg" fontFamily="Comfortaa Variable">
          Organigrama
        </Heading>
      </Flex>

      <Divider />

      <Box w="full" style={{ height: "70vh", border: "1px solid #E2E8F0" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => handleNodeClick(node)}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </Box>

      <Flex direction="row" gap={5} alignItems="center">
        {accessLevel === AccessLevel.EDIT && (
          <>
            <Button variant="solid" colorScheme="teal" onClick={addNewPosition}>
              Agregar Cargo
            </Button>

            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => selectedNode && deletePosition(selectedNode.id)}
              isDisabled={!selectedNode}
            >
              Eliminar Cargo
            </Button>

            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => setIsEditDialogOpen(true)}
              isDisabled={!selectedNode}
            >
              Editar Cargo
            </Button>
          </>
        )}

        <Button
          variant="solid"
          colorScheme="purple"
          onClick={navigateToPositionDetails}
          isDisabled={!selectedNode}
        >
          Ver Manual de Funciones
        </Button>
      </Flex>

      {isEditDialogOpen && selectedNode && (
        <EditPositionDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          positionData={selectedNode.data as PositionNodeData}
          onSave={(updatedData) => {
            // Actualizar el nodo en el estado local
            setNodes((prevNodes) =>
              prevNodes.map((node) => {
                if (node.id === selectedNode.id) {
                  return { ...node, data: { ...updatedData } };
                }
                return node;
              })
            );

            // Actualizar la posición en el backend
            updatePosition(selectedNode.id, updatedData);
          }}
        />
      )}
    </Flex>
  );

  // Actualizar una posición existente
  async function updatePosition(positionId: string, data: PositionNodeData) {
    try {
      // Usar mock API en lugar de axios
      await mockApiResponses.updatePosition(positionId, {
        title: data.title,
        department: data.department,
        description: data.description,
        level: data.level,
      });

      // Actualizar el estado local
      setPositions(prevPositions => 
        prevPositions.map(pos => 
          pos.id === positionId 
            ? { 
                ...pos, 
                title: data.title,
                department: data.department,
                description: data.description,
                level: data.level,
              } 
            : pos
        )
      );

      toast({
        title: "Posición actualizada correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error al actualizar la posición",
        status: "error",
        duration: 3000,
      });
    }
  }
}
