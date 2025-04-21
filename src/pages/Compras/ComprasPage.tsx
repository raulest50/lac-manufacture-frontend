
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,

} from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader';
import {my_style_tab} from "../../styles/styles_general.tsx";
import CrearOCM from "./CrearOCM.tsx";
import ReporteOrdenesCompras from "./ReporteOrdenesCompras.tsx";
import CrearOCA from "./CrearOCA.tsx";

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
                        <CrearOCM/>
                    </TabPanel>

                    <TabPanel>
                        <CrearOCA/>
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
