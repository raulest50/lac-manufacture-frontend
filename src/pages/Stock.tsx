

import {
    Container, VStack, HStack, Flex,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input,
    Button,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import {NavLink} from "react-router-dom";

import {my_style_tab} from "../styles/styles_general.tsx";


function Stock(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl', 'container.2xl', 'container.3xl']}>
            <MyHeader title={'Movimientos y Stock'} />
            <NavLink to={'/'}>
            </NavLink>


            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Registrar Movimiento</Tab>
                    <Tab sx={my_style_tab}>Stock</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                    </TabPanel>

                    <TabPanel>

                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default Stock;