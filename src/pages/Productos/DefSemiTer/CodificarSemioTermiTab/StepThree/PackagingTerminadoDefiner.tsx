import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  useToast
} from "@chakra-ui/react";
import { SearchIcon, DeleteIcon } from "@chakra-ui/icons";
import EndPointsURL from "../../../../../api/EndPointsURL";

// Interfaces based on backend models
interface CasePack {
  id?: number;
  unitsPerCase: number;
  ean14?: string;
  largoCm?: number;
  anchoCm?: number;
  altoCm?: number;
  grossWeightKg?: number;
  insumosEmpaque: InsumoEmpaque[];
}

interface InsumoEmpaque {
  id?: number;
  material: Material;
  cantidad: number;
}

interface Material {
  productoId: string;
  nombre: string;
  tipoUnidades: string;
  tipoMaterial?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (casePack: CasePack) => void;
}

const PackagingTerminadoDefiner: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const endpoints = new EndPointsURL();
  const toast = useToast();

  // State for CasePack data
  const [casePack, setCasePack] = useState<CasePack>({
    unitsPerCase: 0,
    insumosEmpaque: []
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    unitsPerCase: false
  });

  // State for material search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Material[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Validate unitsPerCase
  const validateUnitsPerCase = (value: number) => {
    return value > 0;
  };

  // Handle input changes for CasePack properties
  const handleInputChange = (field: keyof CasePack, value: any) => {
    setCasePack(prev => ({ ...prev, [field]: value }));
    
    // Validate unitsPerCase
    if (field === 'unitsPerCase') {
      setErrors(prev => ({ ...prev, unitsPerCase: !validateUnitsPerCase(value) }));
    }
  };

  // Search for packaging materials
  const searchMaterials = async () => {
    //if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await axios.post(endpoints.consulta_productos, {
        search: searchTerm,
        categories: ["material empaque"], // Filter for packaging materials only
        page: 0,
        size: 10
      });
      
      setSearchResults(response.data.content || []);
    } catch (error) {
      console.error("Error searching materials:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los materiales de empaque",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Add material to insumosEmpaque
  const addMaterial = (material: Material) => {
    // Check if material already exists in the list
    const exists = casePack.insumosEmpaque.some(
      insumo => insumo.material.productoId === material.productoId
    );

    if (exists) {
      toast({
        title: "Material ya agregado",
        description: "Este material ya está en la lista",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Add material with default quantity of 1
    setCasePack(prev => ({
      ...prev,
      insumosEmpaque: [
        ...prev.insumosEmpaque,
        {
          material,
          cantidad: 1
        }
      ]
    }));

    // Clear search results
    setSearchResults([]);
    setSearchTerm("");
  };

  // Update quantity for a material
  const updateQuantity = (index: number, quantity: number) => {
    const newInsumosEmpaque = [...casePack.insumosEmpaque];
    newInsumosEmpaque[index].cantidad = quantity;
    
    setCasePack(prev => ({
      ...prev,
      insumosEmpaque: newInsumosEmpaque
    }));
  };

  // Remove material from insumosEmpaque
  const removeMaterial = (index: number) => {
    setCasePack(prev => ({
      ...prev,
      insumosEmpaque: prev.insumosEmpaque.filter((_, i) => i !== index)
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      validateUnitsPerCase(casePack.unitsPerCase) && 
      casePack.insumosEmpaque.length > 0
    );
  };

  // Handle save
  const handleSave = () => {
    if (isFormValid()) {
      onSave(casePack);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Definir Packaging de Terminado</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Left Panel - Material Search and List */}
            <GridItem>
              <Box borderWidth="1px" borderRadius="lg" p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Materiales de Empaque
                </Text>
                
                {/* Search Input */}
                <FormControl mb={4}>
                  <FormLabel>Buscar Material</FormLabel>
                  <InputGroup>
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nombre del material"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Buscar material"
                        icon={<SearchIcon />}
                        size="sm"
                        onClick={searchMaterials}
                        isLoading={isSearching}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <Box mb={4} maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Código</Th>
                          <Th>Nombre</Th>
                          <Th>Unidad</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {searchResults.map((material) => (
                          <Tr key={material.productoId}>
                            <Td>{material.productoId}</Td>
                            <Td>{material.nombre}</Td>
                            <Td>{material.tipoUnidades}</Td>
                            <Td>
                              <Button
                                size="xs"
                                colorScheme="blue"
                                onClick={() => addMaterial(material)}
                              >
                                Agregar
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
                
                {/* Selected Materials Table */}
                <Box maxH="300px" overflowY="auto">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Código</Th>
                        <Th>Nombre</Th>
                        <Th>Unidad</Th>
                        <Th>Cantidad</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {casePack.insumosEmpaque.map((insumo, index) => (
                        <Tr key={index}>
                          <Td>{insumo.material.productoId}</Td>
                          <Td>{insumo.material.nombre}</Td>
                          <Td>{insumo.material.tipoUnidades}</Td>
                          <Td>
                            <NumberInput
                              min={0.1}
                              step={0.1}
                              value={insumo.cantidad}
                              onChange={(_, value) => updateQuantity(index, value)}
                              size="sm"
                              w="80px"
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Eliminar material"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => removeMaterial(index)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </GridItem>
            
            {/* Right Panel - CasePack Properties */}
            <GridItem>
              <Box borderWidth="1px" borderRadius="lg" p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Propiedades del Empaque
                </Text>
                
                {/* Units Per Case */}
                <FormControl isInvalid={errors.unitsPerCase} mb={4} isRequired>
                  <FormLabel>Unidades por Caja</FormLabel>
                  <NumberInput
                    min={1}
                    value={casePack.unitsPerCase}
                    onChange={(_, value) => handleInputChange('unitsPerCase', value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                  <FormErrorMessage>
                    El valor debe ser mayor que cero
                  </FormErrorMessage>
                </FormControl>
                
                {/* EAN14 */}
                <FormControl mb={4}>
                  <FormLabel>EAN14 / ITF-14</FormLabel>
                  <Input
                    value={casePack.ean14 || ""}
                    onChange={(e) => handleInputChange('ean14', e.target.value)}
                    placeholder="Código EAN14"
                  />
                </FormControl>
                
                {/* Dimensions */}
                <Flex gap={4} mb={4}>
                  <FormControl>
                    <FormLabel>Largo (cm)</FormLabel>
                    <NumberInput
                      min={0}
                      value={casePack.largoCm || ""}
                      onChange={(_, value) => handleInputChange('largoCm', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Ancho (cm)</FormLabel>
                    <NumberInput
                      min={0}
                      value={casePack.anchoCm || ""}
                      onChange={(_, value) => handleInputChange('anchoCm', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Alto (cm)</FormLabel>
                    <NumberInput
                      min={0}
                      value={casePack.altoCm || ""}
                      onChange={(_, value) => handleInputChange('altoCm', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </Flex>
                
                {/* Gross Weight */}
                <FormControl mb={4}>
                  <FormLabel>Peso Bruto (kg)</FormLabel>
                  <NumberInput
                    min={0}
                    value={casePack.grossWeightKg || ""}
                    onChange={(_, value) => handleInputChange('grossWeightKg', value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSave}
            isDisabled={!isFormValid()}
          >
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PackagingTerminadoDefiner;