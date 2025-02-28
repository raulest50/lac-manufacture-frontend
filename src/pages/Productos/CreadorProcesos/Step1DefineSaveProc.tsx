import {Button, Flex} from "@chakra-ui/react";
import ProcessDesigner from "./ProcessDesigner.tsx";
import {Target} from "./types.tsx";



interface Props {
    setActiveStep: (step: number) => void;
    selectedTarget: Target;
}

export default function Step1DefineSaveProc({setActiveStep, selectedTarget}: Props): React.ReactElement {

    const onClickFinalizar = () => {
        setActiveStep(2);
    }

    return(
        <Flex direction={"column"}>

            <ProcessDesigner target={selectedTarget}/>

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