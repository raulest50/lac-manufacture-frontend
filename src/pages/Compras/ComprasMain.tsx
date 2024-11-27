
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,

} from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader';
import RegistrarCompras from "./RegistrarCompras.tsx";
import HistorialCompras from "./HistorialCompras.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";

function ComprasMain() {


    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Modulo de Compras'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Registrar Compras</Tab>
                    <Tab sx={my_style_tab}>Historial Compras</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <RegistrarCompras/>
                    </TabPanel>

                    <TabPanel>
                        <HistorialCompras/>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default ComprasMain;
