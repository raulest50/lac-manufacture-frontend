
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  HStack, 
  Icon, 
  Input, 
  SimpleGrid, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import { FaFileCircleCheck, FaFileCircleXmark } from 'react-icons/fa6';
import { useState } from 'react';

type Props = {
  /**
   * Archivo Excel que se procesará
   */
  file: File | null;
};

/**
 * Este componente se debe comunicar via props
 * @param props
 * @constructor
 */
export function NeedExtractionXls({ file }: Props) {
  // Estados para los inputs
  const [sheetName, setSheetName] = useState<string>('');
  const [codeColumn, setCodeColumn] = useState<string>('');
  const [descriptionColumn, setDescriptionColumn] = useState<string>('');
  const [quantityColumn, setQuantityColumn] = useState<string>('');
  // Nuevos estados para los inputs adicionales
  const [billedQuantityColumn, setBilledQuantityColumn] = useState<string>('');
  const [availableColumn, setAvailableColumn] = useState<string>('');
  const [minStockColumn, setMinStockColumn] = useState<string>('');

  // Función para validar si el archivo es un Excel
  const isValidExcelFile = (file: File | null): boolean => {
    if (!file) return false;
    const validExtensions = ['.xlsx', '.xls'];
    return validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
  };

  // Función para manejar la extracción (declarada pero no implementada)
  const handleExtraction = () => {
    // Esta función se implementará más adelante
    console.log('Extracción de necesidades del archivo:', file?.name);
    console.log('Hoja seleccionada:', sheetName);
    console.log('Columna de código:', codeColumn);
    console.log('Columna de descripción:', descriptionColumn);
    console.log('Columna de cantidad digitada:', quantityColumn);
    console.log('Columna de cantidad facturada:', billedQuantityColumn);
    console.log('Columna de disponible:', availableColumn);
    console.log('Columna de stock mínimo:', minStockColumn);
  };

  const isValid = isValidExcelFile(file);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mt={4}>
      <VStack spacing={4} align="stretch">
        <HStack spacing={3}>
          <Icon 
            as={isValid ? FaFileCircleCheck : FaFileCircleXmark} 
            boxSize="2em" 
            color={isValid ? "green.500" : "red.500"} 
          />
          <Text>
            {isValid 
              ? `Archivo válido: ${file?.name}` 
              : 'No hay archivo Excel válido seleccionado'}
          </Text>
        </HStack>

        {/* Input para seleccionar la hoja de Excel */}
        <FormControl isDisabled={!isValid}>
          <FormLabel>Hoja de Excel</FormLabel>
          <Input 
            placeholder="Nombre de la hoja (ej: Hoja1)" 
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
        </FormControl>

        {/* Grid de 3 columnas para los inputs solicitados */}
        <SimpleGrid columns={3} spacing={4}>
          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Código</FormLabel>
            <Input 
              placeholder="Ej: A" 
              value={codeColumn}
              onChange={(e) => setCodeColumn(e.target.value)}
            />
          </FormControl>

          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Descripción</FormLabel>
            <Input 
              placeholder="Ej: B" 
              value={descriptionColumn}
              onChange={(e) => setDescriptionColumn(e.target.value)}
            />
          </FormControl>

          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Cantidad Digitada</FormLabel>
            <Input 
              placeholder="Ej: C" 
              value={quantityColumn}
              onChange={(e) => setQuantityColumn(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        {/* Nueva fila con grid de 3 columnas para los inputs adicionales */}
        <SimpleGrid columns={3} spacing={4}>
          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Cantidad Facturada</FormLabel>
            <Input 
              placeholder="Ej: D" 
              value={billedQuantityColumn}
              onChange={(e) => setBilledQuantityColumn(e.target.value)}
            />
          </FormControl>

          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Disponible</FormLabel>
            <Input 
              placeholder="Ej: E" 
              value={availableColumn}
              onChange={(e) => setAvailableColumn(e.target.value)}
            />
          </FormControl>

          <FormControl isDisabled={!isValid}>
            <FormLabel>Columna de Stock Mínimo</FormLabel>
            <Input 
              placeholder="Ej: F" 
              value={minStockColumn}
              onChange={(e) => setMinStockColumn(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        <Button 
          colorScheme="blue" 
          isDisabled={!isValid || !sheetName || !codeColumn || !descriptionColumn || !quantityColumn || !billedQuantityColumn || !availableColumn || !minStockColumn}
          onClick={handleExtraction}
          width="fit-content"
        >
          Extracción Necesidades
        </Button>
      </VStack>
    </Box>
  );
};
