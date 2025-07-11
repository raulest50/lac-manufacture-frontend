import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Spinner,
  useToast,
  Input,
  Link,
  FormControl,
  FormLabel,
  Icon,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FaFileCircleQuestion, FaFileCircleCheck } from "react-icons/fa6";
import { AccessLevel, Cargo } from "../types";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL.tsx";

interface Props {
  positionId: string;
  accessLevel: AccessLevel;
  isMaster: boolean;
  onBack: () => void;
}

export default function PositionDetailsPage({ positionId, accessLevel, isMaster, onBack }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [cargo, setCargo] = useState<Cargo | null>(null);
  const [editableUrl, setEditableUrl] = useState<string>("");
  const [manualFile, setManualFile] = useState<File | null>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

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
      setManualFile(file);
    }
  };

  // Cargar los datos del cargo
  useEffect(() => {
    const fetchCargoDetails = async () => {
      try {
        setIsLoading(true);
        const endPoints = new EndPointsURL();

        // Verificar si el usuario tiene acceso al módulo de organigrama
        if (accessLevel === AccessLevel.VIEW || accessLevel === AccessLevel.EDIT || isMaster) {
          // Usar axios para obtener todos los cargos y filtrar por ID
          const response = await axios.get(endPoints.get_all_cargos);
          const cargos = response.data || [];
          const cargoEncontrado = cargos.find(c => c.idCargo === positionId);

          if (cargoEncontrado) {
            setCargo(cargoEncontrado);
            // Inicializar el URL editable
            setEditableUrl(cargoEncontrado.urlDocManualFunciones || "");
          } else {
            console.error("No se encontró el cargo con ID:", positionId);
            toast({
              title: "Cargo no encontrado",
              description: "No se encontró el cargo solicitado",
              status: "error",
              duration: 3000,
            });
          }
        } else {
          // Si el usuario no tiene acceso, mostrar un mensaje
          console.warn("El usuario no tiene acceso al módulo de organigrama");
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al módulo de organigrama",
            status: "warning",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error al cargar los detalles del cargo:", error);

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
            title: "Error al cargar los detalles del cargo",
            description: "Ocurrió un error al cargar los detalles del cargo",
            status: "error",
            duration: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCargoDetails();
  }, [positionId, toast, accessLevel, isMaster]);

  // Guardar la URL del manual de funciones
  const handleSaveManual = async () => {
    if (!cargo) return;

    try {
      const endPoints = new EndPointsURL();

      // Verificar si el usuario tiene permisos de edición
      if (accessLevel !== AccessLevel.EDIT && !isMaster) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para editar el manual de funciones",
          status: "warning",
          duration: 5000,
        });
        return;
      }

      // Actualizar el cargo con la nueva URL
      const updatedCargo = { ...cargo, urlDocManualFunciones: editableUrl };

      // Crear un FormData para enviar el cargo
      const formData = new FormData();
      formData.append('cargo', JSON.stringify(updatedCargo));

      // Usar axios para actualizar el cargo con el endpoint correcto
      const response = await axios.post(
        endPoints.save_cargo_with_manual,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setCargo(response.data);
      setIsEditing(false);

      toast({
        title: "URL del manual de funciones actualizada correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al actualizar la URL del manual de funciones:", error);

      // Verificar si es un error de autorización (403)
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para editar el manual de funciones",
          status: "warning",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error al actualizar la URL del manual de funciones",
          description: "Ocurrió un error al actualizar la URL del manual de funciones",
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!cargo) {
    return (
      <Box>
        <Button leftIcon={<ChevronLeftIcon />} onClick={onBack} mb={4}>
          Volver al Organigrama
        </Button>
        <Text>No se encontró información para este cargo.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack mb={6}>
        <Button leftIcon={<ChevronLeftIcon />} onClick={onBack}>
          Volver al Organigrama
        </Button>

        {(accessLevel === AccessLevel.EDIT || isMaster) && (
          <Button
            colorScheme={isEditing ? "red" : "blue"}
            onClick={() => {
              if (isEditing) {
                // Cancelar edición
                setEditableUrl(cargo.urlDocManualFunciones || "");
                setIsEditing(false);
              } else {
                // Iniciar edición
                setIsEditing(true);
              }
            }}
            ml="auto"
          >
            {isEditing ? "Cancelar" : "Editar URL Manual"}
          </Button>
        )}

        {isEditing && (
          <Button colorScheme="green" onClick={handleSaveManual}>
            Guardar Cambios
          </Button>
        )}
      </HStack>

      <Heading as="h1" size="xl" mb={2}>
        {cargo.tituloCargo}
      </Heading>

      <Text fontSize="lg" color="gray.600" mb={4}>
        Departamento: {cargo.departamento}
      </Text>

      <Text mb={6}>{cargo.descripcionCargo}</Text>

      <Divider mb={6} />

      <Heading as="h2" size="lg" mb={4}>
        Manual de Funciones
      </Heading>

      {isEditing ? (
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="bold">URL del Manual de Funciones (PDF)</FormLabel>
            <Input
              value={editableUrl}
              onChange={(e) => setEditableUrl(e.target.value)}
              placeholder="Ingrese la URL del documento PDF con el manual de funciones"
            />
          </FormControl>
          <Text fontSize="sm" color="gray.500">
            Ingrese la URL completa del documento PDF que contiene el manual de funciones aprobado para este cargo.
          </Text>
        </VStack>
      ) : (
        <VStack spacing={6} align="stretch">
          {cargo.urlDocManualFunciones ? (
            <Box>
              <Link href={cargo.urlDocManualFunciones} isExternal color="blue.500">
                Ver Manual de Funciones (PDF) <ExternalLinkIcon mx="2px" />
              </Link>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Haga clic en el enlace para ver o descargar el manual de funciones completo.
              </Text>
            </Box>
          ) : (
            <Text>No hay un manual de funciones disponible para este cargo.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
}
