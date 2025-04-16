
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,

} from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader';
import {my_style_tab} from "../../styles/styles_general.tsx";
import CrearOrdenCompraMateriales from "./CrearOrdenCompraMateriales.tsx";
import ReporteOrdenesCompras from "./ReporteOrdenesCompras.tsx";
import CrearOrdenCompraActivos from "./CrearOrdenCompraActivos.tsx";

function ComprasPage() {


    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Modulo de Compras'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Crear Orden de Compra para Materiales</Tab>
                    <Tab sx={my_style_tab}>Crear Orden de Compra para Activos</Tab>
                    <Tab sx={my_style_tab}>Reportes Ordenes de Compra</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <CrearOrdenCompraMateriales/>
                    </TabPanel>

                    <TabPanel>
                        <CrearOrdenCompraActivos/>
                    </TabPanel>

                    <TabPanel>
                        <ReporteOrdenesCompras/>
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default ComprasPage;
