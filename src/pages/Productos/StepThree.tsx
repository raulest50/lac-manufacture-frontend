import {ProductoSemiter} from "./types.tsx";
import ProcessDesigner from "./CreadorProcesos/ProcessDesigner.tsx";
import {Button, Flex} from "@chakra-ui/react";



interface props{
    setActiveStep: (step: number) => void;
    semioter2: ProductoSemiter;
    setSemioter3: (semioter3: ProductoSemiter) => void;
}

export default function StepThree({setActiveStep, semioter2, setSemioter3}: props) {


    const onClickFinalizar = () => {
        setActiveStep(2);
    };

    return(
        <Flex direction={"column"}>

            <ProcessDesigner semioter2={semioter2}/>

            <Button
                colorScheme={"teal"}
                variant={"solid"}
                onClick={onClickFinalizar}
            >
                Guardar Proceso
            </Button>
        </Flex>
    )
}