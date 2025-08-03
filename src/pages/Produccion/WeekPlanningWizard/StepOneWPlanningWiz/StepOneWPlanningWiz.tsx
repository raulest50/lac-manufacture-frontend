import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Heading,
    HStack,
    Text,
    VStack
} from '@chakra-ui/react';
import { Nececidades } from '../PlanningWizTypes';
import { FileChooser } from '../../../../components/FileChooser/FileChooser';
import { NeedExtractionXls } from './NeedExtractionXLS';

type StepOneNecesidadProps = {
    onNext?: () => void;
};

export function StepOneWPlanningWiz({ onNext }: StepOneNecesidadProps) {
    // Estado para almacenar el archivo seleccionado
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Función para manejar el avance al siguiente paso
    const handleNext = () => {
        if (onNext && selectedFile) {
            onNext();
        }
    };

    return (
        <Card borderRadius="lg" variant="outline" width="100%">
            <CardBody>
                <VStack spacing={6} align="stretch">
                    <Heading size="md">Definir Necesidades</Heading>

                    <Text>
                        Seleccione un archivo Excel con las necesidades de producción para generar el plan semanal.
                    </Text>

                    {/* Componente FileChooser para seleccionar el archivo */}
                    <FileChooser
                        title="Seleccionar archivo de necesidades"
                        description="Seleccione un archivo Excel con el formato correcto de necesidades"
                        allowedExtensions={{'.xlsx': true, '.xls': true}}
                        setFile={setSelectedFile}
                    />

                    {/* Componente NeedExtractionXls que recibe el archivo */}
                    <NeedExtractionXls file={selectedFile} />

                    {/* Controles de navegación */}
                    <HStack spacing={4} justifyContent="flex-end" mt={4}>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleNext}
                            isDisabled={!selectedFile}
                        >
                            Siguiente
                        </Button>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
