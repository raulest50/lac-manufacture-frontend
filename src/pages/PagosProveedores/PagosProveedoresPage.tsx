import {Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import BuscarTranOcmAsentar from "./BuscarTranOcmAsentar.tsx";

export default function PagosProveedoresPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Pagos a Proveedores'} />
            <Flex direction="column" w="full" h="full">

                <Tabs>

                    <TabList>
                        <Tab sx={my_style_tab} > Asentar Transacciones Almacen </Tab>
                        <Tab sx={my_style_tab} > Facturas Vencidas </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <BuscarTranOcmAsentar />
                        </TabPanel>
                        <TabPanel>
                            Lista de Facturas Vencidas
                        </TabPanel>
                    </TabPanels>

                </Tabs>
            </Flex>
        </Container>
    );
}