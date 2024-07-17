
import {Container, Tabs, TabList, Tab, TabPanels, TabPanel} from "@chakra-ui/react";
import MyHeader from '../components/MyHeader.tsx';


import {my_style_tab} from "../styles/styles_general.tsx";

export default function Produccion(){
    return(
        
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={' Iniciar Orden de Produccion'}/>
            
            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Crear Orden Produccion</Tab>
                    <Tab sx={my_style_tab}>Ordenes Activas</Tab>
                    <Tab sx={my_style_tab}>Historial</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                    </TabPanel>

                    <TabPanel>

                    </TabPanel>

                    <TabPanel>

                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Container>
    )
}
