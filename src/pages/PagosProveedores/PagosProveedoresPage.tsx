import { Container, Flex, Box } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";

export default function PagosProveedoresPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Pagos a Proveedores'} />
            <Flex direction="column" w="full" h="full">
                <Box>
                    {/* Aquí irán los componentes específicos del módulo de Pagos a Proveedores */}
                    {/* Por ejemplo: <GestionPagosProveedores /> */}
                </Box>
            </Flex>
        </Container>
    );
}