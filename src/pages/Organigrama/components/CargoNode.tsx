import { Handle, NodeProps, Position } from "@xyflow/react";
import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  IconButton 
} from "@chakra-ui/react";
import { FaUserTie } from "react-icons/fa";
import { MdBusinessCenter, MdEdit, MdFileDownload } from "react-icons/md";
import { LuMousePointerClick } from "react-icons/lu";
import { Cargo, AccessLevel } from "../types";
import { useCallback } from "react";

const handleStyle = {
  width: "0.8em",
  height: "0.8em",
};

interface PositionNodeData extends Cargo {
  onEdit?: (nodeId: string) => void;
  onViewManual?: (nodeId: string) => void;
}

interface CargoNodeProps extends NodeProps<PositionNodeData> {
  accessLevel: AccessLevel;
  isMaster: boolean;
}

export default function CargoNode(props: CargoNodeProps) {
  const cargo = props.data;
  // Get accessLevel and isMaster from props.data instead of props
  const accessLevel = cargo.accessLevel || props.accessLevel;
  const isMaster = cargo.isMaster || props.isMaster;

  // Callback para editar el cargo
  const handleEdit = useCallback((event) => {
    // Detener la propagación para evitar que el evento llegue al nodo
    event.stopPropagation();

    // Aquí se implementaría la lógica para abrir el diálogo de edición
    // Esta función sería proporcionada por el componente padre
    if (props.data.onEdit) {
      props.data.onEdit(props.id);
    }
  }, [props.id, props.data]);

  // Callback para ver el manual de funciones
  const handleViewManual = useCallback((event) => {
    event.stopPropagation();

    // Si hay una función para ver el manual, usarla
    if (props.data.onViewManual) {
      props.data.onViewManual(props.id);
    }
    // Si no, abrir el manual de funciones en una nueva pestaña
    else if (cargo.urlDocManualFunciones) {
      window.open(cargo.urlDocManualFunciones, '_blank');
    }
  }, [props.id, props.data, cargo.urlDocManualFunciones]);

  return (
    <Box
      border="2px solid"
      borderColor="blue.500"
      borderRadius="md"
      boxShadow={props.selected ? "0 0 10px gold" : ""}
      transition="box-shadow 0.1s ease"
      _hover={props.selected ? { boxShadow: "0 0 10px gold" } : { boxShadow: "0 0 10px blue" }}
      w="220px"
      bg="white"
    >
      <Flex direction="column" align="center">
        <Box w="full" p="0.5em" bg="blue.500" color="white">
          <Text fontWeight="bold" textAlign="center">
            {cargo.tituloCargo}
          </Text>
        </Box>

        <Icon as={FaUserTie} w="3em" h="3em" color="blue.500" my="0.5em" />

        <VStack w="full" p="0.5em" align="start" spacing={1} position="relative">
          <HStack w="full">
            <Icon as={MdBusinessCenter} color="blue.500" />
            <Text fontSize="sm" fontWeight="medium">
              {cargo.departamento}
            </Text>
          </HStack>

          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {cargo.descripcionCargo}
          </Text>

          {cargo.usuario && (
            <Text fontSize="xs" color="blue.600">
              Usuario: {cargo.usuario}
            </Text>
          )}

          {/* Menú de acciones */}
          <Box position="absolute" bottom="2px" right="2px">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Opciones"
                icon={<LuMousePointerClick />}
                variant="ghost"
                size="lg"
                color="blue.500"
                _hover={{ bg: "blue.50" }}
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList>
                {(accessLevel === AccessLevel.EDIT || isMaster) && (
                  <MenuItem icon={<MdEdit />} onClick={handleEdit}>
                    Editar
                  </MenuItem>
                )}

                {cargo.urlDocManualFunciones && (
                  <MenuItem icon={<MdFileDownload />} onClick={handleViewManual}>
                    Ver Manual de Funciones
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>
        </VStack>

        <Handle
          type="target"
          position={Position.Top}
          id="target"
          style={handleStyle}
          isConnectable={accessLevel === AccessLevel.EDIT || isMaster}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="source"
          style={handleStyle}
          isConnectable={accessLevel === AccessLevel.EDIT || isMaster}
        />
      </Flex>
    </Box>
  );
}
