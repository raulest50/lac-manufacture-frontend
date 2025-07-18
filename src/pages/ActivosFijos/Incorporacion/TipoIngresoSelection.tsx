import {Card, CardBody, CardHeader, Flex, Heading, Icon, SimpleGrid, Text} from '@chakra-ui/react';
import {FaClipboardList, FaFileAlt, FaFileInvoiceDollar} from "react-icons/fa";
import {TIPO_INCORPORACION} from "../types";

type Props = {
    setTipoIncorporacion: (tipoIncorporacion: string) => void;
};

export function TipoIngresoSelection({setTipoIncorporacion}: Props) {


    // Declare functions for handling card clicks
    const handleConOCClick = () => {
        setTipoIncorporacion(TIPO_INCORPORACION.CON_OC);
    };

    const handleSinOCClick = () => {
        setTipoIncorporacion(TIPO_INCORPORACION.SIN_OC);
    };

    const handleAFExistenteClick = () => {
        setTipoIncorporacion(TIPO_INCORPORACION.AF_EXISTENTE);
    };




    return (
        <Flex direction={"column"} gap={10} w="full">
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
                Seleccione el tipo de incorporación
            </Heading>

            <SimpleGrid columns={3} spacing={8} w="full">
                {/* Card for "Incorporacion con OC" */}
                <Card
                    h="250px"
                    cursor="pointer"
                    bg="blue.100"
                    _hover={{
                        bg: "blue.300",
                        transform: "translateY(-5px)",
                        boxShadow: "xl"
                    }}
                    _active={{ bg: "blue.800", color: "white" }}
                    transition="all 0.3s ease"
                    onClick={handleConOCClick}
                >
                    <CardHeader borderBottom="0.1em solid" p={4}>
                        <Heading as="h3" size="md" fontFamily="Comfortaa Variable">
                            Incorporación con OC
                        </Heading>
                    </CardHeader>
                    <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
                        <Icon as={FaFileInvoiceDollar} boxSize="5em" mb={4} />
                        <Text textAlign="center">
                            Incorporar activo fijo con orden de compra existente
                        </Text>
                    </CardBody>
                </Card>

                {/* Card for "Incorporacion sin OC" */}
                <Card
                    h="250px"
                    cursor="pointer"
                    bg="green.100"
                    _hover={{
                        bg: "green.300",
                        transform: "translateY(-5px)",
                        boxShadow: "xl"
                    }}
                    _active={{ bg: "green.800", color: "white" }}
                    transition="all 0.3s ease"
                    onClick={handleSinOCClick}
                >
                    <CardHeader borderBottom="0.1em solid" p={4}>
                        <Heading as="h3" size="md" fontFamily="Comfortaa Variable">
                            Incorporación sin OC
                        </Heading>
                    </CardHeader>
                    <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
                        <Icon as={FaFileAlt} boxSize="5em" mb={4} />
                        <Text textAlign="center">
                            Incorporar activo fijo sin orden de compra
                        </Text>
                    </CardBody>
                </Card>

                {/* Card for "Incorporacion AF Existente" */}
                <Card
                    h="250px"
                    cursor="pointer"
                    bg="purple.100"
                    _hover={{
                        bg: "purple.300",
                        transform: "translateY(-5px)",
                        boxShadow: "xl"
                    }}
                    _active={{ bg: "purple.800", color: "white" }}
                    transition="all 0.3s ease"
                    onClick={handleAFExistenteClick}
                >
                    <CardHeader borderBottom="0.1em solid" p={4}>
                        <Heading as="h3" size="md" fontFamily="Comfortaa Variable">
                            Incorporación AF Existente
                        </Heading>
                    </CardHeader>
                    <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
                        <Icon as={FaClipboardList} boxSize="5em" mb={4} />
                        <Text textAlign="center">
                            Incorporar activo fijo existente al sistema
                        </Text>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Flex>
    );
}
