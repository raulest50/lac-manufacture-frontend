
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
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Badge,
  Flex,
  Heading,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FaFileCircleCheck, FaFileCircleXmark, FaTrash, FaCheck, FaFilter } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { NecesidadItem, Nececidades } from '../../PlanningWizTypes';
import ExcelJS from 'exceljs';

type Props = {
  /**
   * Archivo Excel que se procesará
   */
  file: File | null;
  /**
   * Callback para pasar los datos procesados al componente padre
   */
  onDataProcessed?: (data: Nececidades) => void;
};

/**
 * Componente para extraer necesidades de un archivo Excel
 */
export function NeedExtractionXls({ file, onDataProcessed }: Props) {
  // Estados para los inputs de configuración
  const [sheetName, setSheetName] = useState<string>('');
  const [codeColumn, setCodeColumn] = useState<string>('A');
  const [nameColumn, setNameColumn] = useState<string>('B');
  const [needColumn, setNeedColumn] = useState<string>('C');
  const [categoryColumn, setCategoryColumn] = useState<string>('D');

  // Estados para los datos procesados
  const [items, setItems] = useState<NecesidadItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Toast para notificaciones
  const toast = useToast();

  // Efecto para notificar al componente padre cuando los datos cambian
  useEffect(() => {
    if (isProcessed && onDataProcessed) {
      onDataProcessed({
        items,
        categorias: categories
      });
    }
  }, [items, categories, isProcessed, onDataProcessed]);

  // Función para validar si el archivo es un Excel
  const isValidExcelFile = (file: File | null): boolean => {
    if (!file) return false;
    const validExtensions = ['.xlsx', '.xls'];
    return validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
  };

  // Función para procesar el archivo Excel
  const processExcelFile = async () => {
    if (!file || !isValidExcelFile(file)) {
      setError('Archivo no válido');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Leer el archivo Excel con exceljs
      const data = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);

      // Verificar si la hoja especificada existe
      const worksheet = workbook.getWorksheet(sheetName);
      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no existe en el archivo`);
      }

      // Verificar estructura del archivo
      if (worksheet.rowCount < 2) {
        throw new Error('El archivo no contiene suficientes datos');
      }

      // Extraer datos según las columnas especificadas
      const extractedItems: NecesidadItem[] = [];
      const uniqueCategories = new Set<string>();

      // Convertir letras de columna a números (A=1, B=2, etc.)
      const getColumnNumber = (colLetter: string): number => {
        return colLetter.toUpperCase().charCodeAt(0) - 64; // A=65 ASCII, así que A-64=1
      };

      const codeColNum = getColumnNumber(codeColumn);
      const nameColNum = getColumnNumber(nameColumn);
      const needColNum = getColumnNumber(needColumn);
      const categoryColNum = getColumnNumber(categoryColumn);

      // Empezar desde la segunda fila para omitir los encabezados
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // Omitir la primera fila (encabezados)

        const codigo = row.getCell(codeColNum).value?.toString();
        const nombre = row.getCell(nameColNum).value?.toString();
        const necesidadValue = row.getCell(needColNum).value;
        const necesidad = typeof necesidadValue === 'number' 
          ? necesidadValue 
          : parseFloat(necesidadValue?.toString() || '0');
        const categoria = row.getCell(categoryColNum).value?.toString();

        if (codigo && nombre && necesidad && categoria) {
          extractedItems.push({
            codigo,
            nombre,
            necesidad,
            categoria,
            existeEnBD: undefined // Inicialmente desconocido
          });

          uniqueCategories.add(categoria);
        }
      });

      // Actualizar estados
      setItems(extractedItems);
      setCategories(Array.from(uniqueCategories));
      setIsProcessed(true);
      setIsProcessing(false);

      toast({
        title: 'Procesamiento exitoso',
        description: `Se han extraído ${extractedItems.length} items de necesidad`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
      setIsProcessing(false);

      toast({
        title: 'Error de procesamiento',
        description: err instanceof Error ? err.message : 'Error al procesar el archivo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Función para verificar existencia en base de datos (solo declarada)
  const checkExistenceInDB = () => {
    // Esta función se implementará más adelante para verificar en el backend
    // si los productos terminados existen en la base de datos
    console.log('Verificando existencia en base de datos de', items.length, 'items');

    toast({
      title: 'Verificación pendiente',
      description: 'La función para verificar existencia en base de datos será implementada próximamente',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  // Función para eliminar un item
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    // Recalcular categorías únicas
    const uniqueCategories = new Set<string>();
    newItems.forEach(item => uniqueCategories.add(item.categoria));
    setCategories(Array.from(uniqueCategories));

    toast({
      title: 'Item eliminado',
      description: 'El item ha sido eliminado de la lista de necesidades',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Filtrar items por categoría seleccionada
  const filteredItems = selectedCategory 
    ? items.filter(item => item.categoria === selectedCategory) 
    : items;

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

        {/* Configuración de columnas */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" mb={4}>Configuración de Columnas</Heading>

          {/* Input para seleccionar la hoja de Excel */}
          <FormControl isDisabled={!isValid} mb={4}>
            <FormLabel>Hoja de Excel</FormLabel>
            <Input 
              placeholder="Nombre de la hoja (ej: Hoja1)" 
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
          </FormControl>

          {/* Grid de 4 columnas para los inputs solicitados */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl isDisabled={!isValid}>
              <FormLabel>Columna de CODIGO</FormLabel>
              <Input 
                placeholder="Ej: A" 
                value={codeColumn}
                onChange={(e) => setCodeColumn(e.target.value)}
              />
            </FormControl>

            <FormControl isDisabled={!isValid}>
              <FormLabel>Columna de NOMBRE</FormLabel>
              <Input 
                placeholder="Ej: B" 
                value={nameColumn}
                onChange={(e) => setNameColumn(e.target.value)}
              />
            </FormControl>

            <FormControl isDisabled={!isValid}>
              <FormLabel>Columna de NECESIDAD</FormLabel>
              <Input 
                placeholder="Ej: C" 
                value={needColumn}
                onChange={(e) => setNeedColumn(e.target.value)}
              />
            </FormControl>

            <FormControl isDisabled={!isValid}>
              <FormLabel>Columna de CATEGORIA</FormLabel>
              <Input 
                placeholder="Ej: D" 
                value={categoryColumn}
                onChange={(e) => setCategoryColumn(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* Botones de acción */}
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            isDisabled={!isValid || !sheetName || isProcessing}
            onClick={processExcelFile}
            isLoading={isProcessing}
            loadingText="Procesando..."
          >
            Procesar Archivo Excel
          </Button>

          <Button 
            colorScheme="teal" 
            isDisabled={!isProcessed || items.length === 0}
            onClick={checkExistenceInDB}
          >
            Verificar Existencia en BD
          </Button>
        </HStack>

        {/* Mensaje de error */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error:</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabla de resultados */}
        {isProcessed && items.length > 0 && (
          <Box mt={4}>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Items Extraídos ({filteredItems.length} de {items.length})</Heading>

              {/* Selector de categoría */}
              <HStack>
                <Text>Filtrar por categoría:</Text>
                <Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  placeholder="Todas las categorías"
                  width="auto"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </HStack>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Nombre</Th>
                    <Th isNumeric>Necesidad</Th>
                    <Th>Categoría</Th>
                    <Th>Existe en BD</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredItems.map((item, index) => (
                    <Tr key={`${item.codigo}-${index}`}>
                      <Td>{item.codigo}</Td>
                      <Td>{item.nombre}</Td>
                      <Td isNumeric>{item.necesidad}</Td>
                      <Td>
                        <Badge colorScheme="blue">{item.categoria}</Badge>
                      </Td>
                      <Td>
                        {item.existeEnBD === undefined ? (
                          <Badge colorScheme="gray">No verificado</Badge>
                        ) : item.existeEnBD ? (
                          <Badge colorScheme="green">Sí</Badge>
                        ) : (
                          <Badge colorScheme="red">No</Badge>
                        )}
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Eliminar item"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeItem(items.indexOf(item))}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
