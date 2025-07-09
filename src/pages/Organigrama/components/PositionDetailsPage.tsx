import { useState, useEffect } from "react";
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
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { AccessLevel, FunctionManual, Position } from "../types";
import axios from "axios";
// Import mock API responses
import { mockApiResponses } from "../prototype_data";

interface Props {
  positionId: string;
  accessLevel: AccessLevel;
  onBack: () => void;
}

export default function PositionDetailsPage({ positionId, accessLevel, onBack }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [manual, setManual] = useState<FunctionManual | null>(null);
  const [editableManual, setEditableManual] = useState<FunctionManual | null>(null);

  // Cargar los datos de la posición y su manual de funciones
  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        setIsLoading(true);

        // Usar mock API en lugar de axios para obtener datos de la posición
        const positionResponse = await mockApiResponses.getPosition(positionId);
        setPosition(positionResponse.data);

        // Usar mock API en lugar de axios para obtener el manual de funciones
        try {
          const manualResponse = await mockApiResponses.getFunctionManual(positionId);
          setManual(manualResponse.data);
          setEditableManual(manualResponse.data);
        } catch (error) {
          // Si no existe un manual, crear uno vacío
          const emptyManual: FunctionManual = {
            positionId,
            responsibilities: "",
            requirements: "",
            skills: "",
            experience: "",
            education: "",
            additionalInfo: "",
          };
          setManual(emptyManual);
          setEditableManual(emptyManual);
        }
      } catch (error) {
        toast({
          title: "Error al cargar los detalles del cargo",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositionDetails();
  }, [positionId, toast]);

  // Guardar los cambios en el manual de funciones
  const handleSaveManual = async () => {
    if (!editableManual) return;

    try {
      // Usar mock API en lugar de axios
      const response = await mockApiResponses.updateFunctionManual(positionId, editableManual);

      setManual(response.data);
      setIsEditing(false);

      toast({
        title: "Manual de funciones actualizado correctamente",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error al actualizar el manual de funciones",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!position) {
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

        {accessLevel === AccessLevel.EDIT && (
          <Button
            colorScheme={isEditing ? "red" : "blue"}
            onClick={() => {
              if (isEditing) {
                // Cancelar edición
                setEditableManual(manual);
                setIsEditing(false);
              } else {
                // Iniciar edición
                setIsEditing(true);
              }
            }}
            ml="auto"
          >
            {isEditing ? "Cancelar" : "Editar Manual"}
          </Button>
        )}

        {isEditing && (
          <Button colorScheme="green" onClick={handleSaveManual}>
            Guardar Cambios
          </Button>
        )}
      </HStack>

      <Heading as="h1" size="xl" mb={2}>
        {position.title}
      </Heading>

      <Text fontSize="lg" color="gray.600" mb={4}>
        Departamento: {position.department}
      </Text>

      <Text mb={6}>{position.description}</Text>

      <Divider mb={6} />

      <Heading as="h2" size="lg" mb={4}>
        Manual de Funciones
      </Heading>

      {isEditing ? (
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="bold">Responsabilidades</FormLabel>
            <Textarea
              value={editableManual?.responsibilities || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, responsibilities: e.target.value } : null
                )
              }
              rows={5}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Requisitos</FormLabel>
            <Textarea
              value={editableManual?.requirements || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, requirements: e.target.value } : null
                )
              }
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Habilidades</FormLabel>
            <Textarea
              value={editableManual?.skills || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, skills: e.target.value } : null
                )
              }
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Experiencia</FormLabel>
            <Textarea
              value={editableManual?.experience || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, experience: e.target.value } : null
                )
              }
              rows={3}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Formación Académica</FormLabel>
            <Textarea
              value={editableManual?.education || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, education: e.target.value } : null
                )
              }
              rows={3}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Información Adicional</FormLabel>
            <Textarea
              value={editableManual?.additionalInfo || ""}
              onChange={(e) =>
                setEditableManual(prev => 
                  prev ? { ...prev, additionalInfo: e.target.value } : null
                )
              }
              rows={4}
            />
          </FormControl>
        </VStack>
      ) : (
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Responsabilidades
            </Heading>
            <Text whiteSpace="pre-line">{manual?.responsibilities || "No especificado"}</Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Requisitos
            </Heading>
            <Text whiteSpace="pre-line">{manual?.requirements || "No especificado"}</Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Habilidades
            </Heading>
            <Text whiteSpace="pre-line">{manual?.skills || "No especificado"}</Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Experiencia
            </Heading>
            <Text whiteSpace="pre-line">{manual?.experience || "No especificado"}</Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Formación Académica
            </Heading>
            <Text whiteSpace="pre-line">{manual?.education || "No especificado"}</Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Información Adicional
            </Heading>
            <Text whiteSpace="pre-line">{manual?.additionalInfo || "No especificado"}</Text>
          </Box>
        </VStack>
      )}
    </Box>
  );
}
