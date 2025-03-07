
import { Container, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader.tsx';
import { my_style_tab } from '../../styles/styles_general.tsx';

import CodificarMateriaPrima from './CodificarMateriaPrima.tsx';
import CodificarSemioTermi from "./CodificarSemioTermi.tsx";

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
                        <CodificarMateriaPrima />
                    </TabPanel>

                    <TabPanel>
                        <CodificarSemioTermi />
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default ProductosPage;
