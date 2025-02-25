

import {DocIngresoDTA} from "./types.tsx";
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Icon,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Image,
    Textarea,
    FormControl, FormLabel
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import {useState} from "react";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL.tsx";


interface StepThreeComponentProps {
    setActiveStep: (step: number) => void;
    docIngresoDTA: DocIngresoDTA | null;
}

const endpoints = new EndPointsURL();

export default function StepThreeComponent({
                                             setActiveStep,
                                             docIngresoDTA,
                                         }: StepThreeComponentProps) {

    const [observaciones, setObservaciones] = useState("");

    const onClickEnviar = async () => {
        if (!docIngresoDTA || !docIngresoDTA.file) {
            console.error("No document data or file provided");
            return;
        }

        // Create a copy of the docIngresoDTA excluding the file property.
        const { file, ...docData } = docIngresoDTA;

        // Build FormData.
        const formData = new FormData();
        formData.append(
            "docIngresoDTA",
            new Blob([JSON.stringify(docData)], { type: "application/json" })
        );
        formData.append("file", file);

        try {
            const response = await axios.post(endpoints.save_doc_ingreso_oc, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("DocIngreso created successfully:", response.data);
            // Optionally, proceed to the next step or update UI accordingly.
            setActiveStep(4);
        } catch (error) {
            console.error("Error creating DocIngreso:", error);
        }
    };


    return (
        <Flex
            p="1em"
            direction="column"
            backgroundColor="blue.50"
            gap={8}
            alignItems="center"
        >
            <Heading fontFamily="Comfortaa Variable">
                Formato De Ingreso A Almacen
            </Heading>
            <Text fontFamily="Comfortaa Variable">
                Verifique el formato de ingreso a almacen. En caso de algun error regrese al paso 1.
            </Text>
            <Text fontFamily="Comfortaa Variable">
                Si el formato esta bien, continue con el envio del mismo para finalizar el procedimiento y dar ingreso de los items a el almacen
            </Text>

            <Divider/>

            {/* Table with Order Items */}
            <Box w="full" overflowX="auto" >
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Producto ID</Th>
                            <Th>Nombre</Th>
                            <Th isNumeric>Cantidad</Th>
                            <Th>Verificado</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {docIngresoDTA?.ordenCompra?.itemsOrdenCompra.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.materiaPrima.productoId}</Td>
                                <Td>{item.materiaPrima.nombre}</Td>
                                <Td isNumeric>{item.cantidad}</Td>
                                <Td > <Icon as={FaCheckCircle} w={"2em"} h={"2em"} color={"green.400"} /> </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>


            <Text fontFamily="Comfortaa Variable">
                Documento Soporte:
            </Text>
            <Box w={"full"}>
                <Image
                    src={docIngresoDTA ? URL.createObjectURL(docIngresoDTA.file) : ""}
                    alt="Documento Soporte"
                    objectFit="contain"
                    borderRadius="md"
                    boxSize="100%"
                />
            </Box>

            <FormControl>
                <FormLabel>Observaciones (Opcional) </FormLabel>
                <Textarea
                    placeholder='Escriba aqui sus observaciones si lo considera pertinente'
                    value={observaciones}
                    onChange={(e) => {
                        docIngresoDTA ? docIngresoDTA.observaciones = e.target.value : {};
                        setObservaciones(e.target.value);
                        }
                    }
                >

                </Textarea>
            </FormControl>


            <Divider/>

            <Button
                variant="solid"
                colorScheme={"teal"}
                onClick={onClickEnviar}
            >
                Enviar Formato De Ingreso
            </Button>

        </Flex>
    );

}
