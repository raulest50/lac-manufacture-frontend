
import { Container, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader.tsx';
import { my_style_tab } from '../../styles/styles_general.tsx';

import CodificarMateriaPrima from './CodificarMateriaPrima.tsx';
import ProcessDesignTab from "./CreadorProcesos/ProcessDesignTab.tsx";
import CrearSemioTermi from "./CrearSemioTermi.tsx";

function ProductosPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <MyHeader title="Codificar Producto" />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Codificar Material Primario</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                    <Tab sx={my_style_tab}>Diseño De Procesos</Tab>
                </TabList>

                <TabPanels>

                    <TabPanel>
                        <CodificarMateriaPrima />
                    </TabPanel>

                    <TabPanel>
                        <CrearSemioTermi />
                    </TabPanel>

                    <TabPanel p={0} height="100%">
                        < ProcessDesignTab/>
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default ProductosPage;
