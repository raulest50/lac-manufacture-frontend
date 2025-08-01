import {Container, Flex,
    Tab, TabList, TabPanel, TabPanels, Tabs
}
    from "@chakra-ui/react";

import MyHeader from "../../components/MyHeader.tsx";

import {IncorporacionActivosFijos} from "./Incorporacion/IncorporacionActivosFijos.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import CrearOC_AF from "./OC/CrearOC_AF.tsx";
import {ReportesTabAf} from "./Reportes/ReportesTabAF.tsx";

export default function ActivosFijosPage() {




    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Activos'} />
            <Flex direction="column" w="full" h="full">

                <Tabs>

                    <TabList>
                        <Tab sx={my_style_tab}> Incorporacion </Tab>
                        <Tab sx={my_style_tab}> Crear OC-AF </Tab>
                        <Tab sx={my_style_tab}> Reportes OC-AF </Tab>
                        <Tab sx={my_style_tab}> Reportes Activos Fijos </Tab>
                        {/*<Tab sx={my_style_tab}> Mantenimientos </Tab>*/}
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <IncorporacionActivosFijos />
                        </TabPanel>

                        <TabPanel>
                            <CrearOC_AF />
                        </TabPanel>

                        <TabPanel>
                            <ReportesTabAf />
                        </TabPanel>

                    </TabPanels>

                </Tabs>

            </Flex>
        </Container>
    );
}