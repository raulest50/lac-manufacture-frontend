
import {OrdenCompra} from "./types.tsx";


import {Button, Divider, Flex, Heading, Icon, IconButton, Text} from "@chakra-ui/react";

import { MdAddAPhoto } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import {useState} from "react";

interface StepTwoComponentProps {
    setActiveStep: (step: number) => void;
    selectedOrder: (orden: OrdenCompra) => void;
}

export default function StepTwoComponent(
    {setActiveStep, selectedOrder}: StepTwoComponentProps) {

    const [file, setFile] = useState<File | null>(null);

    const onClickContinuar = () => {
        setActiveStep(2);
    };

    const onClickBrowse = () => {
        console.log(selectedOrder);
        console.log(setFile);
    };

    const onClickCamera = () => {

    };

    return(
        <Flex
            p="1em"
            direction="column"
            backgroundColor="blue.50"
            gap={8}
            alignItems="center"
        >
            <Heading fontFamily="Comfortaa Variable">
                Adjuntar Documento Soporte
            </Heading>

            <Text fontFamily="Comfortaa Variable" > Debe adjuntar un documento soporte para terminar de diligenciar el formato de ingreso a almacen </Text>
            <Text fontFamily="Comfortaa Variable" > El soporte lo puede adjuntar tomando una foto del documento fisico presentado por el proveedor o adjuntando un scan del mismo </Text>
            <Divider />
            <Flex
                direction={"row"}
                gap={"10em"}
                p={"1em"}
                justifyContent={"center"}
                w={"full"}
            >
                <IconButton colorScheme={"teal"} icon={<FaFolderOpen/>} aria-label='Buscar Archivo' fontSize={"5em"} w={"2em"} h={"2em"} onClick={onClickBrowse} />
                <IconButton colorScheme={"teal"} icon={<MdAddAPhoto/>} aria-label='Tomar una Foto' fontSize={"5em"} w={"2em"} h={"2em"} onClick={onClickCamera} />
            </Flex>

            <Divider />

            <Flex
                direction={"row"}
                gap={"1em"}
                p={"1em"}
                justifyContent={"center"}
                w={"full"}
            >
                <Icon
                    as={ file ? FaFileCircleCheck : FaFileCircleQuestion }
                    boxSize={"4em"}
                    color={ file ? "green" : "orange.500" }
                />
                <Text fontFamily="Comfortaa Variable" >
                    {
                        file ?
                            "Se ha cargado el documento soporte correctamente y puede continuar al paso final"
                            :
                            "Aun no ha subido ningun archivo/foto soporte"
                    }
                </Text>
            </Flex>

            <Button
                colorScheme={"teal"}
                variant={"solid"}
                onClick={onClickContinuar}
                isDisabled={ !file }
            >
                Continuar</Button>

        </Flex>
    );
}