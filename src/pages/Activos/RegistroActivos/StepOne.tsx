import {useState} from 'react';
import {Button, Flex} from '@chakra-ui/react';

type Props = {
    setActiveStep: (step: number) => void;
    setIncorporacionActivoHeader: (incorporacionActivoHeader: any) => void;
};

export function StepOne({setActiveStep, setIncorporacionActivoHeader}: Props) {
    return (
        <Flex direction={"column"} gap={10}>
            <Flex direction={"row"}>
                <Button
                    onClick={() => setActiveStep(2)}
                >
                    Siguiente
                </Button>

                <Button
                    onClick={() => setActiveStep(0)}
                >
                    Atras
                </Button>
            </Flex>
        </Flex>
    );
}
