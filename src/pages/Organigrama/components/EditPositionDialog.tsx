import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { Cargo } from "../types";
import { FaFileCircleQuestion, FaFileCircleCheck } from "react-icons/fa6";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL.tsx";

interface User {
  id: number;
  username: string;
  nombreCompleto?: string;
}

interface EditPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cargo: Cargo;
  onSave: (updatedCargo: Cargo) => void;
  assignedUsers?: string[]; // Lista de usuarios ya asignados a otros cargos
}

export default function EditPositionDialog({
  isOpen,
  onClose,
  cargo,
  onSave,
  assignedUsers = [],
}: EditPositionDialogProps) {
  const toast = useToast();
  const [localData, setLocalData] = useState<Cargo>(cargo);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const endPoints = new EndPointsURL();

  // Cargar los datos del cargo
  useEffect(() => {
    setLocalData(cargo);
  }, [cargo]);

  // Cargar la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await axios.get(endPoints.get_all_users);
        // Filtrar el usuario "master" y los usuarios ya asignados
        const filteredUsers = response.data.filter(
          (user: User) => 
            user.username !== 'master' && 
            !assignedUsers.includes(user.username) || 
            (localData.usuario && user.username === localData.usuario)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        toast({
          title: "Error al cargar los usuarios",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [endPoints.get_all_users, assignedUsers, localData.usuario, toast]);

  // Manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Tipo de archivo no permitido",
          description: "Solo se permiten archivos PDF para el manual de funciones.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }
      setLocalData({ ...localData, manualFuncionesFile: file });
    }
  };

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Cargo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>ID del Cargo</FormLabel>
            <Input
                value={localData.idCargo}
                onChange={(e) =>
                    setLocalData({...localData, idCargo: e.target.value})
                }
                placeholder="Identificador único del cargo"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Título del Cargo</FormLabel>
            <Input
              value={localData.tituloCargo}
              onChange={(e) =>
                setLocalData({ ...localData, tituloCargo: e.target.value })
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Departamento</FormLabel>
            <Input
              value={localData.departamento}
              onChange={(e) =>
                setLocalData({ ...localData, departamento: e.target.value })
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              value={localData.descripcionCargo}
              onChange={(e) =>
                setLocalData({ ...localData, descripcionCargo: e.target.value })
              }
              placeholder="Descripción breve del cargo"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Nivel Jerárquico</FormLabel>
            <NumberInput
              min={1}
              max={10}
              value={localData.nivel}
              onChange={(valueString) =>
                setLocalData({ ...localData, nivel: parseInt(valueString) })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Usuario</FormLabel>
            <Select
              value={localData.usuario || ""}
              onChange={(e) =>
                setLocalData({ ...localData, usuario: e.target.value })
              }
              placeholder="Seleccione un usuario"
              isDisabled={isLoadingUsers}
            >
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.nombreCompleto || user.username}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Manual de Funciones</FormLabel>
            <VStack spacing={4} align="stretch" alignItems="center">
              <Icon
                as={localData.manualFuncionesFile || localData.urlDocManualFunciones ? FaFileCircleCheck : FaFileCircleQuestion}
                boxSize="4em"
                color={localData.manualFuncionesFile || localData.urlDocManualFunciones ? "green" : "orange.500"}
              />
              <Button onClick={() => manualInputRef.current?.click()}>Seleccionar Archivo</Button>
              <Input
                type="file"
                ref={manualInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {localData.urlDocManualFunciones && (
                <Button 
                  as="a" 
                  href={localData.urlDocManualFunciones} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                >
                  Ver Manual Actual
                </Button>
              )}
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
