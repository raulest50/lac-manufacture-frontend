import { ProductoSemiter } from "../../types.tsx";
import ProcessDesigner from "../../DefProcesses/CreadorProcesos/ProcessDesigner.tsx";
import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
    setActiveStep: (step: number) => void;
    semioter2: ProductoSemiter;
    setSemioter3: (semioter3: ProductoSemiter) => void;
}

export default function StepThree({ setActiveStep, semioter2, setSemioter3 }: Props) {
    // Local state to store whether the process definition is valid.
    const [isProcessValid, setIsProcessValid] = useState(false);

    const onClickSiguiente = () => {
        setActiveStep(3);
    };

    const onClickAtras = () => {
        setActiveStep(1);
    };

    return (
        <Flex direction="column">
            <ProcessDesigner
                semioter2={semioter2}
                setSemiter3={setSemioter3}
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
                    isDisabled={!isProcessValid}  // Disabled if process definition is invalid.
                >
                    Siguiente
                </Button>
            </Flex>
        </Flex>
    );
}
