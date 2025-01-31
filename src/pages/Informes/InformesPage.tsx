


import MyHeader from '../../components/MyHeader';
import {Container, Tab, TabList, TabPanels, Tabs, TabPanel} from "@chakra-ui/react";

import {my_style_tab} from "../../styles/styles_general.tsx";
import InformesCompras from "./InformesCompras.tsx";

export default function InformesPage(){

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Informes'} />

            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Informe Materias Primas</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <InformesCompras/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )

}