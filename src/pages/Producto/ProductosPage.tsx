import React from 'react';
import { Container, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';

import MyHeader from '../../components/MyHeader.tsx';
import { my_style_tab } from '../../styles/styles_general.tsx';

import CodificarProducto from './CodificarProducto';
import CrearReceta from './CrearReceta';

function ProductosPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <MyHeader title="Codificar Producto" />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Materia Prima</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <CodificarProducto />
                    </TabPanel>

                    <TabPanel>
                        <CrearReceta />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default ProductosPage;
