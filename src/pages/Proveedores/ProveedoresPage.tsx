
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,

} from "@chakra-ui/react";

import MyHeader from "../../components/MyHeader.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import CodificarProveedor from "./CodificarProveedor.tsx";
import {ConsultarProveedores} from "./consultar/ConsultarProveedores.tsx";


function ProveedoresPage() {


    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Registrar Proveedor'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}> Codificar Proveedor </Tab>
                    <Tab sx={my_style_tab}> Consultar Proveedores </Tab>
                </TabList>

                <TabPanels>

                    <TabPanel>
                        <CodificarProveedor/>
                    </TabPanel>

                    <TabPanel>
                        <ConsultarProveedores />
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default ProveedoresPage;
