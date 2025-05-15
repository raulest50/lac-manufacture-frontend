import {
    Flex, Box, Heading, Text, Button, VStack, HStack, 
    Grid, GridItem, Card, CardHeader,
    CardBody,
} from '@chakra-ui/react';
import {Proveedor} from "../types.tsx";
import { ArrowBackIcon } from '@chakra-ui/icons';

type Props = {
    proveedor: Proveedor;
    setEstado: (estado: number) => void;
};

/**
 * componente que muestra la informacion detallada de un proveedor dado.
 * como una especie de Proveedor Card.
 * @param proveedor
 * @constructor
 */
export function DetalleProveedor({proveedor, setEstado}: Props) {
    const handleBack = () => {
        setEstado(0);
    };

    // Map category IDs to names
    const categoryNames = [
        'Servicios Operativos',
        'Materias Primas',
        'Materiales de empaque',
        'Servicios administrativos',
        'Equipos y otros servicios'
    ];

    const getCategoriesText = (categories: number[]): string => {
        return categories.map(catId => categoryNames[catId]).join(', ');
    };

    // Map regime type to text
    const getRegimenText = (regimen: number): string => {
        const regimenes = [
            'Régimen Simplificado',
            'Régimen Común',
            'Gran Contribuyente',
            'Régimen Especial'
        ];
        return regimenes[regimen] || 'Desconocido';
    };

    return (
        <Box p={5}>
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Button 
                    leftIcon={<ArrowBackIcon />} 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={handleBack}
                >
                    Regresar
                </Button>
                <Heading size="lg">Detalle del Proveedor</Heading>
                <Box></Box> {/* Empty box for flex alignment */}
            </Flex>

            <Card mb={5}>
                <CardHeader bg="blue.50">
                    <Heading size="md">{proveedor.nombre}</Heading>
                    <Text color="gray.600">ID: {proveedor.id}</Text>
                </CardHeader>
                <CardBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem>
                            <VStack align="start" spacing={3}>
                                <Box>
                                    <Text fontWeight="bold">Dirección:</Text>
                                    <Text>{proveedor.direccion || 'No especificada'}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Ubicación:</Text>
                                    <Text>{proveedor.ciudad || 'No especificada'}{proveedor.departamento ? `, ${proveedor.departamento}` : ''}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Régimen Tributario:</Text>
                                    <Text>{getRegimenText(proveedor.regimenTributario)}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Condición de Pago:</Text>
                                    <Text>{proveedor.condicionPago}</Text>
                                </Box>
                            </VStack>
                        </GridItem>
                        <GridItem>
                            <VStack align="start" spacing={3}>
                                <Box>
                                    <Text fontWeight="bold">Categorías:</Text>
                                    <Text>{getCategoriesText(proveedor.categorias)}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">URL:</Text>
                                    <Text>{proveedor.url || 'No especificada'}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Observaciones:</Text>
                                    <Text>{proveedor.observacion || 'Sin observaciones'}</Text>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>

            {proveedor.contactos && proveedor.contactos.length > 0 && (
                <Card>
                    <CardHeader bg="blue.50">
                        <Heading size="md">Contactos</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            {proveedor.contactos.map((contacto, index) => (
                                <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <GridItem>
                                            <Text fontWeight="bold">{contacto.fullName}</Text>
                                            <Text color="gray.600">{contacto.cargo}</Text>
                                        </GridItem>
                                        <GridItem>
                                            <HStack>
                                                <Text fontWeight="bold">Cel:</Text>
                                                <Text>{contacto.cel}</Text>
                                            </HStack>
                                            <HStack>
                                                <Text fontWeight="bold">Email:</Text>
                                                <Text>{contacto.email}</Text>
                                            </HStack>
                                        </GridItem>
                                    </Grid>
                                </Box>
                            ))}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </Box>
    );
}
