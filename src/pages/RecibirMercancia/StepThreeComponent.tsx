

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


interface StepThreeComponentProps {
    setActiveStep: (step: number) => void;
    docIngresoDTA: DocIngresoDTA | null;
}

export default function StepThreeComponent({
                                             setActiveStep,
                                             docIngresoDTA,
                                         }: StepThreeComponentProps) {

    const [observaciones, setObservaciones] = useState("");

    const onClickEnviar = () => {
        console.log(setActiveStep);
        console.log(docIngresoDTA);
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
                    onChange={(e) => setObservaciones(e.target.value)}
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
