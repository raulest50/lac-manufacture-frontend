import {useCallback, useEffect, useState} from "react";
import {Box, Button, Flex, useToast} from "@chakra-ui/react";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeChange,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CargoNode from "./CargoNode.tsx";
import {AccessLevel, Cargo} from "../types";
import EditCargoDialog from "./EditCargoDialog.tsx";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL.tsx";

const nodeTypes = {
  positionNode: CargoNode,
};

const endPoints = new EndPointsURL();

interface Props {
  accessLevel: AccessLevel;
  isMaster: boolean;
  organizationChartId: string;
}

export default function OrganizationChart({ 
  accessLevel, 
  isMaster,
  organizationChartId
}: Props) {
  const toast = useToast();
  const [positions, setPositions] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

  // Find the highest existing ID and return the next ID
  const getNextId = () => {
    // Find the highest existing ID
    let highestId = -1;
    positions.forEach(cargo => {
      // Convert idCargo to number if possible
      const idNumber = parseInt(cargo.idCargo);
      // Only consider valid numeric IDs
      if (!isNaN(idNumber) && idNumber > highestId) {
        highestId = idNumber;
      }
    });

    // Increment the highest ID by 1
    return (highestId + 1).toString();
  };

  // Estados para el diálogo de detalles
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [detailsNode, setDetailsNode] = useState<Node | null>(null);

  // Convertir cargos a nodos para React Flow
  const createNodesFromCargos = (cargos: Cargo[]): Node[] => {
    return cargos.map((cargo, index) => ({
      id: cargo.idCargo,
      data: { 
        ...cargo,
        accessLevel: accessLevel,  // Añadir accessLevel
        isMaster: isMaster,        // Añadir isMaster
        onEdit: (nodeId:string) => {
          // Establecer el nodo seleccionado y abrir el diálogo de edición
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            setSelectedNode(node);
            setIsEditDialogOpen(true);
          }
        },
        onViewManual: (nodeId: string) => {
          // Abrir el diálogo de detalles en lugar de navegar
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            setDetailsNode(node);
            setIsDetailsDialogOpen(true);
          }
        }
      },
      position: { 
        x: cargo.posicionX || 250 * (cargo.nivel || 1), 
        y: cargo.posicionY || index * 150 
      },
      type: "positionNode",
    }));
  };

  // Crear conexiones entre nodos basadas en la relación jefeInmediato
  const createEdgesFromPositions = (cargos: Cargo[]): Edge[] => {
    return cargos
      .filter(cargo => cargo.jefeInmediato)
      .map(cargo => ({
        id: `e-${cargo.jefeInmediato}-${cargo.idCargo}`,
        source: cargo.jefeInmediato!,
        target: cargo.idCargo,
        type: 'smoothstep',
      }));
  };

  // Validar un cargo individual
  const validarCargoData = (cargo: Cargo): boolean => {
    // Verificar que todos los campos obligatorios estén presentes
    return !!(
      cargo.idCargo && 
      cargo.tituloCargo && 
      cargo.tituloCargo.trim() !== "" && 
      cargo.departamento && 
      cargo.departamento.trim() !== "" && 
      cargo.descripcionCargo && 
      cargo.descripcionCargo.trim() !== "" &&
      cargo.nivel
    );
  };

  // Validar todos los cargos del organigrama
  const validarOrganigramaData = (cargos: Cargo[]): boolean => {
    // Si no hay cargos, el organigrama es válido (vacío)
    if (cargos.length === 0) return true;

    // Verificar que todos los cargos sean válidos
    return cargos.every(cargo => validarCargoData(cargo));
  };

  // Estado para controlar si el organigrama es válido
  const [isOrganigramaValid, setIsOrganigramaValid] = useState<boolean>(true);

  // Cargar datos del organigrama
  useEffect(() => {
    const fetchOrganizationChart = async () => {
      try {
        setIsLoading(true);

        // Verificar si el usuario tiene acceso al módulo de organigrama
        if (accessLevel === AccessLevel.VIEW || accessLevel === AccessLevel.EDIT || isMaster) {
          // Usar el endpoint correcto para obtener todos los cargos
          const response = await axios.get(endPoints.get_all_cargos);
          setPositions(response.data || []);
        } else {
          // Si el usuario no tiene acceso, mostrar un mensaje
          console.warn("El usuario no tiene acceso al módulo de organigrama");
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al módulo de organigrama",
            status: "warning",
            duration: 5000,
          });
          setPositions([]);
        }
      } catch (error) {
        console.error("Error al cargar el organigrama:", error);

        // Verificar si es un error de autorización (403)
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al módulo de organigrama",
            status: "warning",
            duration: 5000,
          });
        } else {
          toast({
            title: "Error al cargar el organigrama",
            description: "Ocurrió un error al cargar los datos del organigrama",
            status: "error",
            duration: 3000,
          });
        }

        // En caso de error, inicializar con un array vacío
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationChart();
  }, [organizationChartId, toast, accessLevel, isMaster]);

  const initialNodes = createNodesFromCargos(positions);
  const initialEdges = createEdgesFromPositions(positions);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Manejar cambios en los nodos y detectar cambios de posición
  const handleNodesChange = (changes: NodeChange[]) => {
    // Si el usuario tiene nivel de acceso VIEW y no es master, no permitir mover los nodos
    if (accessLevel === AccessLevel.VIEW && !isMaster) {
      // Filtrar los cambios para eliminar los de tipo 'position'
      const filteredChanges = changes.filter(change => change.type !== 'position');
      onNodesChange(filteredChanges);
    } else {
      onNodesChange(changes);

      // Si hay cambios de posición, marcar como cambios sin guardar
      if (changes.some(change => change.type === 'position')) {
        setHasUnsavedChanges(true);
      }
    }
  };

  // Actualizar nodos y conexiones cuando cambian las posiciones
  useEffect(() => {
    setNodes(createNodesFromCargos(positions));
    setEdges(createEdgesFromPositions(positions));

    // Actualizar la lista de usuarios asignados
    const users = positions
      .filter(cargo => cargo.usuario)
      .map(cargo => cargo.usuario as string);
    setAssignedUsers(users);
  }, [positions, setNodes, setEdges]);

  // Actualizar la validación cuando cambian las posiciones
  useEffect(() => {
    setIsOrganigramaValid(validarOrganigramaData(positions));
  }, [positions]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Permitir conexiones si el usuario tiene nivel de acceso de edición o es master
      if (accessLevel === AccessLevel.EDIT || isMaster) {
        setEdges((eds) => addEdge(params, eds));
        setHasUnsavedChanges(true);

        // Actualizar la relación reportTo solo localmente
        const sourceId = params.source;
        const targetId = params.target;

        if (sourceId && targetId) {
          // Actualizar el estado local de las posiciones
          const updatedPositions = positions.map(cargo => 
            cargo.idCargo === targetId ? { ...cargo, jefeInmediato: sourceId } : cargo
          );

          // Actualizar el estado local
          setPositions(updatedPositions);
        }
      }
    },
    [accessLevel, isMaster, setEdges, positions]
  );

  // Guardar los cambios del organigrama
  const saveOrganizationChanges = async () => {
    // Solo permitir guardar cambios si el usuario tiene nivel de acceso de edición o es master
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    // Validar el organigrama antes de guardarlo
    if (!isOrganigramaValid) {
      toast({
        title: "Error al guardar los cambios",
        description: "Hay cargos con datos incompletos",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      // Actualizar las posiciones de los nodos en el estado
      const updatedPositions = positions.map(cargo => {
        const node = nodes.find(n => n.id === cargo.idCargo);
        if (node) {
          return {
            ...cargo,
            posicionX: node.position.x,
            posicionY: node.position.y
          };
        }
        return cargo;
      });

      // Verificar si hay cargos temporales
      const hasTempCargos = updatedPositions.some(cargo => cargo.idCargo.startsWith('temp-'));

      // Si hay cargos temporales, solo actualizar el estado local
      if (hasTempCargos) {
        setPositions(updatedPositions);
        setEdges(createEdgesFromPositions(updatedPositions));
        setHasUnsavedChanges(true);

        toast({
          title: "Cambios guardados localmente",
          description: "Hay cargos temporales que deben ser completados antes de guardar en el servidor",
          status: "info",
          duration: 5000,
        });
        return;
      }

      // Remover propiedades de UI antes de enviar al backend
      const cleanedPositions = updatedPositions.map(({ accessLevel, isMaster, onEdit, onViewManual, ...cargo }) => cargo);

      // Llamar a la API para guardar los cambios
      const response = await axios.post(endPoints.save_changes_organigrama, cleanedPositions);

      // Verificar que la respuesta contiene todos los cargos
      if (response.data && Array.isArray(response.data)) {
        // Asegurarse de que todos los cargos locales estén presentes en la respuesta
        const responseIds = response.data.map(cargo => cargo.idCargo);
        const missingCargos = updatedPositions.filter(cargo => !responseIds.includes(cargo.idCargo));

        // Si hay cargos que faltan en la respuesta, mantenerlos en el estado local
        const finalPositions = missingCargos.length > 0 
          ? [...response.data, ...missingCargos] 
          : response.data;

        // Actualizar el estado local con la respuesta del servidor
        setPositions(finalPositions);

        // Actualizar las conexiones
        setEdges(createEdgesFromPositions(finalPositions));
      } else {
        // Si la respuesta no es válida, mantener el estado local actualizado
        console.warn("La respuesta del servidor no contiene datos válidos");
        setPositions(updatedPositions);
        setEdges(createEdgesFromPositions(updatedPositions));
      }

      setHasUnsavedChanges(false);

      toast({
        title: "Cambios guardados correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast({
        title: "Error al guardar los cambios",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Actualizar la relación jefeInmediato de un cargo (solo localmente)
  const updatePositionReportTo = (cargoId: string, reportToId: string) => {
    // Solo permitir actualizar relaciones si el usuario tiene nivel de acceso de edición o es master
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    // Actualizar el estado local
    const updatedPositions = positions.map(cargo => 
      cargo.idCargo === cargoId ? { ...cargo, jefeInmediato: reportToId } : cargo
    );

    // Actualizar el estado local inmediatamente para reflejar la conexión
    setPositions(updatedPositions);

    // Actualizar las conexiones localmente
    setEdges(createEdgesFromPositions(updatedPositions));

    // Marcar que hay cambios sin guardar
    setHasUnsavedChanges(true);
  };

  // Agregar un nuevo cargo
  const addNewPosition = () => {
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    const newCargo: Cargo = {
      idCargo: getNextId(),
      tituloCargo: "",
      departamento: "",
      descripcionCargo: "",
      nivel: 1,
      posicionX: 100,
      posicionY: nodes.length * 150
    };

    // Crear el nodo para el nuevo cargo
    const newNode: Node = {
      id: newCargo.idCargo.toString(),
      data: {
        ...newCargo,
        accessLevel: accessLevel,  // Añadir accessLevel
        isMaster: isMaster,        // Añadir isMaster
        onEdit: (nodeId:string) => {
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            setSelectedNode(node);
            setIsEditDialogOpen(true);
          }
        },
        onViewManual: (nodeId:string) => {
          // Abrir el diálogo de detalles en lugar de navegar
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            setDetailsNode(node);
            setIsDetailsDialogOpen(true);
          }
        }
      },
      position: { x: newCargo.posicionX, y: newCargo.posicionY },
      type: "positionNode",
    };

    // Añadir el nuevo cargo al estado local
    setPositions(prevPositions => [...prevPositions, newCargo]);
    setNodes(prevNodes => [...prevNodes, newNode]);

    // Abrir automáticamente el diálogo de edición para el nuevo cargo
    setSelectedNode(newNode);
    setIsEditDialogOpen(true);
  };

  // Guardar un nuevo cargo en el backend
  const saveNewPosition = async (cargo: Cargo) => {
    // Solo permitir crear cargos si el usuario tiene nivel de acceso de edición o es master
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    // Validar el cargo antes de guardarlo
    if (!validarCargoData(cargo)) {
      toast({
        title: "Error al crear el cargo",
        description: "Todos los campos son obligatorios",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      // Crear un FormData para enviar el cargo
      const formData = new FormData();

      // Extraer el archivo del cargo y propiedades de UI y eliminarlos del objeto JSON
      const { manualFuncionesFile, accessLevel, isMaster, onEdit, onViewManual, ...cargoData } = cargo;

      // Agregar el cargo como JSON
      formData.append('cargo', JSON.stringify(cargoData));

      // Agregar el archivo si existe
      if (manualFuncionesFile) {
        formData.append('manualFuncionesFile', manualFuncionesFile);
      }

      // Usar axios para crear el cargo
      const response = await axios.post(
        endPoints.save_cargo_with_manual,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const savedCargo = response.data;

      // Actualizar el estado local con el cargo guardado
      setPositions(prevCargos => 
        prevCargos.map(c => c.idCargo === cargo.idCargo ? savedCargo : c)
      );

      // Actualizar el nodo correspondiente
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === cargo.idCargo 
            ? { ...node, id: savedCargo.idCargo, data: { ...node.data, ...savedCargo } } 
            : node
        )
      );

      // Actualizar las conexiones para reflejar el nuevo cargo
      const updatedPositions = positions.map(c => 
        c.idCargo === cargo.idCargo ? savedCargo : c
      );
      setEdges(createEdgesFromPositions(updatedPositions));

      toast({
        title: "Cargo creado correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al crear el cargo:", error);
      toast({
        title: "Error al crear el cargo",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Eliminar un cargo
  const deletePosition = async (cargoId: string) => {
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    try {
      // Si es un cargo temporal (no guardado en el backend), solo eliminarlo del estado local
      if (cargoId.startsWith('temp-')) {
        // Actualizar el estado local
        setPositions(prevCargos => prevCargos.filter(cargo => cargo.idCargo !== cargoId));
        setNodes(prevNodes => prevNodes.filter(node => node.id !== cargoId));
        setEdges(prevEdges => 
          prevEdges.filter(edge => edge.source !== cargoId && edge.target !== cargoId)
        );

        toast({
          title: "Cargo eliminado correctamente",
          status: "success",
          duration: 3000,
        });
        return;
      }

      // Para cargos guardados en el backend, eliminar y luego guardar los cambios
      // Actualizar el estado local primero
      const updatedPositions = positions.filter(cargo => cargo.idCargo !== cargoId);

      // Guardar una copia de las posiciones actualizadas para comparar después
      const localUpdatedPositions = [...updatedPositions];

      // Remover propiedades de UI antes de enviar al backend
      const cleanedPositions = updatedPositions.map(({ accessLevel, isMaster, onEdit, onViewManual, ...cargo }) => cargo);

      // Llamar a la API para guardar los cambios (sin el cargo eliminado)
      const response = await axios.post(endPoints.save_changes_organigrama, cleanedPositions);

      // Verificar que la respuesta contiene todos los cargos esperados
      if (response.data && Array.isArray(response.data)) {
        // Asegurarse de que todos los cargos locales (excepto el eliminado) estén presentes en la respuesta
        const responseIds = response.data.map(cargo => cargo.idCargo);
        const missingCargos = localUpdatedPositions.filter(cargo => !responseIds.includes(cargo.idCargo));

        // Si hay cargos que faltan en la respuesta, mantenerlos en el estado local
        const finalPositions = missingCargos.length > 0 
          ? [...response.data, ...missingCargos] 
          : response.data;

        // Actualizar el estado local con la respuesta del servidor
        setPositions(finalPositions);

        // Actualizar los nodos y las conexiones
        setNodes(prevNodes => prevNodes.filter(node => node.id !== cargoId));
        setEdges(createEdgesFromPositions(finalPositions));
      } else {
        // Si la respuesta no es válida, mantener el estado local actualizado sin el cargo eliminado
        console.warn("La respuesta del servidor no contiene datos válidos");
        setPositions(localUpdatedPositions);
        setNodes(prevNodes => prevNodes.filter(node => node.id !== cargoId));
        setEdges(createEdgesFromPositions(localUpdatedPositions));
      }

      toast({
        title: "Cargo eliminado correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar el cargo:", error);
      toast({
        title: "Error al eliminar el cargo",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Manejar la selección de nodos
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };


  return (
    <Flex direction="column" gap={8} p="1em">

      <Box w="full" style={{ height: "70vh", border: "1px solid #E2E8F0" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => handleNodeClick(node)}
          nodesDraggable={accessLevel === AccessLevel.EDIT || isMaster}
          nodesConnectable={accessLevel === AccessLevel.EDIT || isMaster}
          edgesFocusable={accessLevel === AccessLevel.EDIT || isMaster}
          fitView
          proOptions={{
            account: 'paid-pro',
            hideAttribution: true
          }}
          defaultEdgeOptions={{
            type: 'smoothstep'
          }}
        >
          <Controls />
          {/* <MiniMap /> */}
          {/* <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> */}
        </ReactFlow>
      </Box>

      <Flex direction="row" gap={5} alignItems="center" wrap="wrap">
        {(accessLevel === AccessLevel.EDIT || isMaster) && (
          <>
            <Button
                variant="solid"
                colorScheme="teal"
                onClick={addNewPosition}
                //visibility={ accessLevel === AccessLevel.EDIT || isMaster ? "visible" : "hidden"}
                display={ accessLevel === AccessLevel.EDIT || isMaster ? "" : "none"}
            >
              Agregar Cargo
            </Button>

            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => selectedNode && deletePosition(selectedNode.id)}
              isDisabled={!selectedNode}
              //visibility={ accessLevel === AccessLevel.EDIT || isMaster ? "visible" : "hidden"}
              display={ accessLevel === AccessLevel.EDIT || isMaster ? "" : "none"}
            >
              Eliminar Cargo
            </Button>

            <Button
              variant="solid" 
              colorScheme="green"
              onClick={saveOrganizationChanges}
              isDisabled={!hasUnsavedChanges || !isOrganigramaValid}
              //visibility={ accessLevel === AccessLevel.EDIT || isMaster ? "visible" : "hidden"}
              display={ accessLevel === AccessLevel.EDIT || isMaster ? "" : "none"}
            >
              Guardar Cambios Organigrama
            </Button>
          </>
        )}
      </Flex>

      {isEditDialogOpen && selectedNode && (
        <EditCargoDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          cargo={(selectedNode.data as unknown) as Cargo}
          assignedUsers={assignedUsers}
          mode="edit"
          accessLevel={accessLevel}
          isMaster={isMaster}
          onSave={(updatedCargo) => {
            // Actualizar el nodo en el estado local
            setNodes((prevNodes) =>
              prevNodes.map((node) => {
                if (node.id === selectedNode.id) {
                  return { ...node, data: { ...node.data, ...updatedCargo } };
                }
                return node;
              })
            );

            // Si es un cargo nuevo (ID temporal), usar saveNewPosition
            if (selectedNode.id.startsWith('temp-')) {
              saveNewPosition(updatedCargo);
            } else {
              // Si es un cargo existente, usar updatePosition
              updatePosition(selectedNode.id, updatedCargo);
            }
          }}
        />
      )}

      {/* Diálogo de detalles */}
      {isDetailsDialogOpen && detailsNode && (
        <EditCargoDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          cargo={(detailsNode.data as unknown) as Cargo}
          mode="view"
          accessLevel={accessLevel}
          isMaster={isMaster}
          onSave={() => {}} // No se usa en modo visualización, pero es requerido por la interfaz
        />
      )}
    </Flex>
  );

  // Actualizar un cargo existente
  async function updatePosition(cargoId: string, cargo: Cargo) {
    // Solo permitir actualizar cargos si el usuario tiene nivel de acceso de edición o es master
    if (accessLevel !== AccessLevel.EDIT && !isMaster) return;

    // Validar el cargo antes de actualizarlo
    if (!validarCargoData(cargo)) {
      toast({
        title: "Error al actualizar el cargo",
        description: "Todos los campos son obligatorios",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      // Crear un FormData para enviar el cargo
      const formData = new FormData();

      // Extraer el archivo del cargo y propiedades de UI y eliminarlos del objeto JSON
      const { manualFuncionesFile, accessLevel, isMaster, onEdit, onViewManual, ...cargoData } = cargo;

      // Agregar el cargo como JSON
      formData.append('cargo', JSON.stringify(cargoData));

      // Agregar el archivo si existe
      if (manualFuncionesFile) {
        formData.append('manualFuncionesFile', manualFuncionesFile);
      }

      // Usar axios para actualizar el cargo
      const response = await axios.post(
        endPoints.save_cargo_with_manual,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Verificar que la respuesta es válida
      if (response.data) {
        const updatedCargo = response.data;

        // Actualizar el estado local
        setPositions(prevCargos => 
          prevCargos.map(c => 
            c.idCargo === cargoId ? updatedCargo : c
          )
        );

        // Actualizar las conexiones para reflejar el cargo actualizado
        const updatedPositions = positions.map(c => 
          c.idCargo === cargoId ? updatedCargo : c
        );
        setEdges(createEdgesFromPositions(updatedPositions));

        toast({
          title: "Cargo actualizado correctamente",
          status: "success",
          duration: 3000,
        });
      } else {
        console.warn("La respuesta del servidor no contiene datos válidos");
        toast({
          title: "Error al actualizar el cargo",
          description: "La respuesta del servidor no es válida",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error al actualizar el cargo:", error);
      toast({
        title: "Error al actualizar el cargo",
        status: "error",
        duration: 3000,
      });
    }
  }
}
