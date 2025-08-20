import { ProductoSemiter, ProcesoDiseñado, ProcesoProduccionCompleto } from "../../../types.tsx";
import ProcessDesigner from "../../../DefProcesses/CreadorProcesos/ProcessDesigner.tsx";
import { Button, Flex, FormControl, FormLabel, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useState } from "react";

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

    const onClickSiguiente = () => {
        const procesoCompleto: ProcesoProduccionCompleto = {
            ...proceso,
            rendimientoTeorico,
        };
        setSemioter3({ ...semioter2, procesoProduccionCompleto: procesoCompleto });
        setActiveStep(3);
    };

    const onClickAtras = () => {
        setActiveStep(1);
    };

    return (
        <Flex direction="column" gap={4}>
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
                    isDisabled={!isProcessValid || rendimientoTeorico <= 0}  // Disabled if process definition is invalid.
                >
                    Siguiente
                </Button>
            </Flex>
        </Flex>
    );
}
