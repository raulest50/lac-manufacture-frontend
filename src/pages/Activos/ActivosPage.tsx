import {Container, Flex,
    Tab, TabList, TabPanel, TabPanels, Tabs
}
    from "@chakra-ui/react";

import MyHeader from "../../components/MyHeader.tsx";

import {RegistroActivosMainComp} from "./RegistroActivos/RegistroActivosMainComp.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";

export default function ActivosPage() {




    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Activos'} />
            <Flex direction="column" w="full" h="full">

                <Tabs>

                    <TabList>
                        <Tab sx={my_style_tab}> Incorporacion </Tab>
                        <Tab sx={my_style_tab}> Reporte </Tab>
                        <Tab sx={my_style_tab}> Categorias </Tab>
                        <Tab sx={my_style_tab}> Traslados </Tab>
                        <Tab sx={my_style_tab}> Mantenimientos </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <RegistroActivosMainComp />
                        </TabPanel>

                    </TabPanels>

                </Tabs>

            </Flex>
        </Container>
    );
}