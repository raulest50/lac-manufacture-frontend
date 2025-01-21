
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,

} from "@chakra-ui/react";

import MyHeader from "../../components/MyHeader.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import RegistrarProveedor from "./RegistrarProveedor.tsx";


function ProveedoresPage() {


    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Registrar Proveedor'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}> Modulo Proveedores</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <RegistrarProveedor/>
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default ProveedoresPage;
