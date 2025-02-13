
import {Button, Flex, Heading, Text} from "@chakra-ui/react";
import { OrdenCompra } from "./types.tsx";
import EndPointsURL from "../../api/EndPointsURL.tsx";
import {useState} from "react";


interface StepOneComponentProps {
    setActiveStep: (step: number) => void;
    orden: OrdenCompra | null ;
}



export default function StepOneComponent({setActiveStep, orden}: StepOneComponentProps) {

    const [okContinuar, setOkContinuar] = useState(false);

    const onClickContinuar = () => {
        setActiveStep(2);
    };


    return(
        <>
            <Flex p={"1em"} direction={"column"} backgroundColor={"blue.50"} gap={4} alignItems={"center"}>
                <Heading fontFamily={'Comfortaa Variable'}>Verificar Cantidades</Heading>
                <Text fontFamily={'Comfortaa Variable'}>Para cada item verifique que las cantidades concuerdan, de lo contrario no se puede hacer ingreso a almacen</Text>
                <Flex w={"40%"} direction={"column"} gap={4}>
                    <Button
                        variant={"solid"}
                        colorScheme={"teal"}
                        disabled={okContinuar}
                        onClick={onClickContinuar}
                    > Confirmar Las Cantidades Concuerdan</Button>
                </Flex>
            </Flex>
        </>
    );
}