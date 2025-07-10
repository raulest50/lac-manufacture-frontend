import React from 'react';
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import { my_style_tab } from "../../styles/styles_general.tsx";

const ClientesPage: React.FC = () => {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Gestión de Clientes'} />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Registrar Cliente</Tab>
                    <Tab sx={my_style_tab}>Consultar Clientes</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {/* Contenido para registrar clientes */}
                        <p>Formulario de registro de clientes en desarrollo.</p>
                    </TabPanel>
                    <TabPanel>
                        {/* Contenido para consultar clientes */}
                        <p>Listado de clientes en desarrollo.</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
};

export default ClientesPage;
