
import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FaFileCircleCheck, FaFileCircleXmark } from 'react-icons/fa6';

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

                <Button 
                    colorScheme="blue" 
                    isDisabled={!isValid}
                    onClick={handleExtraction}
                    width="fit-content"
                >
                    Extracción Necesidades
                </Button>
            </VStack>
        </Box>
    );
};
