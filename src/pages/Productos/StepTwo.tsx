import {ProductoSemiter, MateriaPrima, Semiterminado, TIPOS_PRODUCTOS} from "./types.tsx";
import React, {useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Text,
    VStack
} from "@chakra-ui/react";
import {FaSearch} from "react-icons/fa";
import {getRegimenTributario} from "../Compras/types.tsx";


interface props {
    setActiveStep: (step: number) => void;
    semioter: ProductoSemiter;
}

export default function StepTwo({setActiveStep, semioter}:props){

    const [listaMp, setListaMp] = useState<MateriaPrima[]>([]);
    const [listaSemi, setListaSemi] = useState<Semiterminado[]>([]);
    const [selectMp_Semi, setSelectMpSemi] = useState(TIPOS_PRODUCTOS.materiaPrima);


    const onClickSiguiente = () => {

    };

    const onClickCleanLists = () => {
        setListaMp([]);
        setListaSemi([]);
    };

    return(
        <Flex direction="column" gap={4} align="center">

            <Card>
                <CardHeader>
                    <HStack>
                        <Heading size="sm">
                            {selectedProveedor.nombre}
                        </Heading>
                    </HStack>
                </CardHeader>
                <Divider />
                <CardBody>
                    <HStack>
                        <VStack alignItems="start">
                            <Text pt="2" fontSize="sm">
                                Nit: {selectedProveedor ? selectedProveedor.id : ""}
                            </Text>
                            <Text pt="2" fontSize="sm">
                                Tel: {selectedProveedor ? selectedProveedor.telefono : ""}
                            </Text>
                            <Text pt="2" fontSize="sm">
                                Ciudad: {selectedProveedor ? selectedProveedor.ciudad : ""}
                            </Text>
                        </VStack>

                        <VStack alignItems="start">
                            <Text pt="2" fontSize="sm">
                                RegimenTributario: {selectedProveedor ? getRegimenTributario(selectedProveedor.regimenTributario) : ""}
                            </Text>
                        </VStack>

                    </HStack>
                </CardBody>
            </Card>

            <HStack gap={8}>

                <Flex direction={"column"} align={"center"}>
                    {
                        /**
                         * GPT, here i want a table with chakra ui v 2.0
                         * to display the list of materiasPrimas (listaMp) or
                         *
                         *
                         */
                    }
                </Flex>

                <Flex direction={"column"} align={"center"}>
                    {
                        /**
                         *
                         *
                         *
                         */
                    }
                </Flex>

            </HStack>

            <Flex direction={"row"} gap={10}>
                <Button
                    variant = {"solid"}
                    colorScheme={"teal"}
                    onClick={onClickSiguiente}
                >
                    Siguiente
                </Button>

                <Button
                    variant = {"solid"}
                    colorScheme={"red"}
                    onClick={onClickCleanLists}
                >
                    Limpiar Bandeja Seleccion
                </Button>

            </Flex>

        </Flex>
    );
}