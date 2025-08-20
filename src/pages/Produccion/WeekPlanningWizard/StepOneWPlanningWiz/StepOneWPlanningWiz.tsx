import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Heading,
    HStack,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';
import { Nececidades } from '../PlanningWizTypes';
import { FileChooser } from '../../../../components/FileChooser/FileChooser';
import { NeedExtractionXls } from './NeedExtractionXLS';

type StepOneNecesidadProps = {
    onNext?: () => void;
    onDataProcessed?: (data: Nececidades) => void;
};

export function StepOneWPlanningWiz({ onNext, onDataProcessed }: StepOneNecesidadProps) {
    // Estado para almacenar el archivo seleccionado
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // Estado para almacenar los datos procesados
    const [processedData, setProcessedData] = useState<Nececidades | null>(null);
    // Toast para notificaciones
    const toast = useToast();

    // Función para manejar los datos procesados
    const handleDataProcessed = (data: Nececidades) => {
        setProcessedData(data);

        // Si hay un callback para pasar los datos al componente padre, lo llamamos
        if (onDataProcessed) {
            onDataProcessed(data);
        }

        toast({
            title: 'Datos procesados',
            description: `Se han procesado ${data.items.length} items de necesidad en ${data.categorias.length} categorías`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para manejar el avance al siguiente paso
    const handleNext = () => {
        if (onNext && selectedFile && processedData) {
            onNext();
        } else if (!processedData) {
            toast({
                title: 'Datos no procesados',
                description: 'Debe procesar el archivo Excel antes de continuar',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Definir Necesidades</Heading>

                    <Text>
                        Seleccione un archivo Excel con las necesidades de producción para generar el plan semanal.
                        El archivo debe tener columnas para CODIGO, NOMBRE, NECESIDAD y CATEGORIA.
                    </Text>

                    {/* Componente FileChooser para seleccionar el archivo */}
                    <FileChooser
                        title="Seleccionar archivo de necesidades"
                        description="Seleccione un archivo Excel con el formato correcto de necesidades"
                        allowedExtensions={{'.xlsx': true, '.xls': true}}
                        setFile={setSelectedFile}
                    />

                    {/* Componente NeedExtractionXls que recibe el archivo y el callback */}
                    <NeedExtractionXls 
                        file={selectedFile} 
                        onDataProcessed={handleDataProcessed} 
                    />

                    {/* Controles de navegación */}
                    <HStack spacing={4} justifyContent="flex-end" mt={4}>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleNext}
                            isDisabled={!selectedFile || !processedData}
                        >
                            Siguiente
                        </Button>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
