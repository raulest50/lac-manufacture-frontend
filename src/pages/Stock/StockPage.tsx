
import {Container, Tabs, TabList, Tab, TabPanels, TabPanel
} from "@chakra-ui/react";


import MyHeader from '../../components/MyHeader.tsx';
import Inventario from "./Inventario.tsx";

import {my_style_tab} from "../../styles/styles_general.tsx";
import InventarioEnTransito from "./InventarioEnTransito.tsx";


export default function StockPage() {

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ordenes De ProduccionPage'}/>

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Inventario</Tab>
                    <Tab sx={my_style_tab}>Inventario En Transito</Tab>
                </TabList>
                <TabPanels>

                    <TabPanel>
                        <Inventario/>
                    </TabPanel>

                    <TabPanel>
                        <InventarioEnTransito/>
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    )
}

