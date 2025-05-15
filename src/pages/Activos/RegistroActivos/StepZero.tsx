import {useState} from 'react';
import {Button, Flex} from '@chakra-ui/react';
import {OrdenCompraActivo} from "../types.tsx";

type Props = {
    setActiveStep: (step: number) => void;
    setOrdenCompraActivo: (ordenCompraActivo: OrdenCompraActivo) => void;
};

/**
 * Primer paso, identificar Orden Compra Activo
 *
 * Ningun Activo se puede dar ingreso sin la correspondiente orden de
 * compra de activos.
 *
 * @param setStep
 * @constructor
 */
export function StepZero({setActiveStep}: Props) {

    //const [ocaId, setOcaId] = useState<number>(); // id orden de compra para los activos.

    return (
        <Flex direction={"column"} gap={10}>
            <Flex direction={"row"}>
                <Button
                    onClick={() => setActiveStep(1)}
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
