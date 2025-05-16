import {Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import {IncorporarPersonal} from "./IncorporarPersonal.tsx";
import {ConsultaDePersonal} from "./ConsultaDePersonal.tsx";

export default function PersonalPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Personal'} />
            <Flex direction="column" w="full" h="full">
                <Tabs>
                    <TabList>
                        <Tab sx={my_style_tab}>Incorporacion</Tab>
                        <Tab sx={my_style_tab}> Consulta </Tab>
                    </TabList>

                    <TabPanels>

                        <TabPanel>
                            <IncorporarPersonal/>
                        </TabPanel>

                        <TabPanel>
                            <ConsultaDePersonal/>
                        </TabPanel>

                    </TabPanels>

                </Tabs>
            </Flex>
        </Container>
    );
}