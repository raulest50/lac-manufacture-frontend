import {Button, Flex} from "@chakra-ui/react";


interface Props {
    setActiveStep: (step: number) => void;
}

export default function Step2Finish({setActiveStep}: Props) {

    const onClickSave = () => {
        setActiveStep(0);
    }

    return(
        <Flex direction={"column"}>
            <Button
                variant={"solid"}
                colorScheme={"blue"}
                onClick={onClickSave}
            >
               Finalizar
            </Button>
        </Flex>
    );
}