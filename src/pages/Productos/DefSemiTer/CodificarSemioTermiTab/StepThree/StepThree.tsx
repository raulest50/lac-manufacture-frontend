import { ProductoSemiter, ProcesoDiseñado, ProcesoProduccionCompleto } from "../../../types.tsx";
import ProcessDesigner from "../../../DefProcesses/CreadorProcesos/ProcessDesigner.tsx";
import { 
    Button, 
    Flex, 
    FormControl, 
    FormLabel, 
    NumberInput, 
    NumberInputField,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    HStack
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from "react";
import AreaPickerGeneric from "../../../../../components/AreaPickerGeneric/AreaPickerGeneric.tsx";

// Interface for AreaProduccion based on the backend model
interface AreaProduccion {
    areaId: number;
    nombre: string;
    descripcion: string;
    responsableArea?: any;
}

interface Props {
    setActiveStep: (step: number) => void;
    semioter2: ProductoSemiter;
    setSemioter3: (semioter3: ProductoSemiter) => void;
}

export default function StepThree({ setActiveStep, semioter2, setSemioter3 }: Props) {
    // Local state to store whether the process definition is valid.
    const [isProcessValid, setIsProcessValid] = useState(false);
    const [rendimientoTeorico, setRendimientoTeorico] = useState<number>(0);
    const [proceso, setProceso] = useState<ProcesoDiseñado>({ procesosProduccion: [] });

    // State for area picker
    const [isAreaPickerOpen, setIsAreaPickerOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<AreaProduccion | null>(null);

    const handleOpenAreaPicker = () => {
        setIsAreaPickerOpen(true);
    };

    const handleCloseAreaPicker = () => {
        setIsAreaPickerOpen(false);
    };

    const handleSelectArea = (area: AreaProduccion) => {
        setSelectedArea(area);
    };

    const onClickSiguiente = () => {
        const procesoCompleto: ProcesoProduccionCompleto = {
            ...proceso,
            rendimientoTeorico,
            areaProduccion: selectedArea || undefined,
        };
        setSemioter3({ ...semioter2, procesoProduccionCompleto: procesoCompleto });
        setActiveStep(3);
    };

    const onClickAtras = () => {
        setActiveStep(1);
    };

    return (
        <Flex direction="column" gap={4}>
            <HStack spacing={4} alignItems="flex-start">
                <FormControl w="sm">
                    <FormLabel>Rendimiento Teórico</FormLabel>
                    <NumberInput
                        min={0}
                        value={rendimientoTeorico}
                        onChange={(_, value) => setRendimientoTeorico(value)}
                    >
                        <NumberInputField />
                    </NumberInput>
                </FormControl>

                <FormControl w="sm">
                    <FormLabel>Área de Producción</FormLabel>
                    <InputGroup>
                        <Input
                            value={selectedArea ? `${selectedArea.nombre}` : ''}
                            placeholder="Seleccione un área"
                            isReadOnly
                            bg="gray.50"
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label="Buscar área"
                                icon={<SearchIcon />}
                                size="sm"
                                onClick={handleOpenAreaPicker}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
            </HStack>

            <ProcessDesigner
                semioter2={semioter2}
                onProcessChange={setProceso}
                onValidityChange={setIsProcessValid}
            />

            <Flex
                direction="row"
                w="full"
                gap={20}
                justifyContent="center"
                pr="2em"
                pl="2em"
            >
                <Button colorScheme="yellow" variant="solid" onClick={onClickAtras} flex={2}>
                    Atras
                </Button>

                <Button
                    colorScheme="teal"
                    variant="solid"
                    onClick={onClickSiguiente}
                    flex={2}
                    isDisabled={!isProcessValid || rendimientoTeorico <= 0 || !selectedArea}  // Disabled if process definition is invalid or no area selected
                >
                    Siguiente
                </Button>
            </Flex>

            <AreaPickerGeneric
                isOpen={isAreaPickerOpen}
                onClose={handleCloseAreaPicker}
                onSelectArea={handleSelectArea}
            />
        </Flex>
    );
}
