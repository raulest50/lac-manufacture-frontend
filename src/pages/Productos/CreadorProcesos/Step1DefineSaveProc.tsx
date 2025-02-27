import {Button, Flex} from "@chakra-ui/react";
import ProcessDesigner from "./ProcessDesigner.tsx";


interface Props {
    setActiveStep: (step: number) => void;
}

export default function Step1DefineSaveProc({setActiveStep}: Props): React.ReactElement {

    const onClickFinalizar = () => {
        setActiveStep(2);
    }

    return(
        <Flex direction={"column"}>

            <ProcessDesigner />

            <Button
                colorScheme={"teal"}
                variant={"solid"}
                onClick={onClickFinalizar}
            >
                Guardar Proceso
            </Button>
        </Flex>
    );
}