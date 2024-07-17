
import {Container, Tabs, TabList, Tab, TabPanels, TabPanel} from "@chakra-ui/react";
import MyHeader from '../components/MyHeader.tsx';

export default function Produccion(){
    return(
        
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={' Iniciar Orden de Produccion'}/>
            
            <Tabs>
                <TabList>
                    <Tab>Crear Orden Produccion</Tab>
                    <Tab>Ordenes Activas</Tab>
                    <Tab>Historial</Tab>
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
