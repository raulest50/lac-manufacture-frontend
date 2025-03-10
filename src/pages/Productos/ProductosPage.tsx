
import { Container, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader.tsx';
import { my_style_tab } from '../../styles/styles_general.tsx';

import CodificarMateriaPrimaTab from './CodificarMateriaPrimaTab.tsx';
import CodificarSemioTermiTab from "./CodificarSemioTermiTab.tsx";

function ProductosPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <MyHeader title="Codificar Producto" />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Codificar Material Primario</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>

                </TabList>

                <TabPanels>

                    <TabPanel>
                        <CodificarMateriaPrimaTab />
                    </TabPanel>

                    <TabPanel>
                        <CodificarSemioTermiTab />
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default ProductosPage;
