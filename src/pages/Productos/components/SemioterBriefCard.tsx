import {Card, CardBody, CardHeader, Divider, Flex, Heading, Text, VStack} from "@chakra-ui/react";
import {ProductoSemiter, TIPOS_PRODUCTOS} from "../types.tsx";

interface props{
    semioter: ProductoSemiter;
}

export default function SemioterBriefCard({semioter}:props) {

    const calculateNoOfLines = (text:string, maxCharsPerLine = 5) => {
        if (!text) return 1; // Fallback for empty text
        return Math.ceil(text.length / maxCharsPerLine);
    };

    return(
        <Card w={'full'}>
            <CardHeader>
                <VStack>
                    <Heading size="md">
                        Nombre: {semioter.nombre}
                    </Heading>
                    <Heading pt="2" fontSize="sm">
                        Tipo Producto: {semioter.tipo_producto === TIPOS_PRODUCTOS.terminado ? "Terminado" : "Semiterminado"}
                    </Heading>
                </VStack>
            </CardHeader>
            <Divider color={"gray.400"} />
            <CardBody>
                <Flex direction={"row"} gap={10}>
                    <VStack alignItems="start">
                        <Text pt="2" fontSize="sm">
                            Unidades: {semioter.tipoUnidades}
                        </Text>
                        <Text pt="2" fontSize="sm">
                            Contenido por envase: {semioter.cantidadUnidad}
                        </Text>
                    </VStack>

                    <VStack alignItems="start">
                        <Text pt="2" fontSize="sm">
                            Codigo: {semioter.productoId}
                        </Text>
                        <Text pt="2" fontSize="sm" noOfLines={calculateNoOfLines(semioter.observaciones)}>
                            Observaciones: {semioter.observaciones}
                        </Text>
                    </VStack>

                </Flex>
            </CardBody>
        </Card>
    );
}