import { Container, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import CatalogoCuentas from "./cuentas/CatalogoCuentas";
import ListaAsientos from "./asientos/ListaAsientos";
import LibroMayor from "./reportes/LibroMayor";
import BalanceComprobacion from "./reportes/BalanceComprobacion";
import EstadosFinancieros from "./reportes/EstadosFinancieros";
import GestionPeriodos from "./periodos/GestionPeriodos";

export default function ContabilidadPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Contabilidad'} />
            <Flex direction="column" w="full" h="full">
                <Tabs variant="enclosed" colorScheme="blue" isLazy>
                    <TabList>
                        <Tab>Catálogo de Cuentas</Tab>
                        <Tab>Asientos Contables</Tab>
                        <Tab>Reportes</Tab>
                        <Tab>Períodos</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <CatalogoCuentas />
                        </TabPanel>
                        <TabPanel>
                            <ListaAsientos />
                        </TabPanel>
                        <TabPanel>
                            <Tabs variant="soft-rounded" colorScheme="green" isLazy>
                                <TabList>
                                    <Tab>Libro Mayor</Tab>
                                    <Tab>Balance de Comprobación</Tab>
                                    <Tab>Estados Financieros</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <LibroMayor />
                                    </TabPanel>
                                    <TabPanel>
                                        <BalanceComprobacion />
                                    </TabPanel>
                                    <TabPanel>
                                        <EstadosFinancieros />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </TabPanel>
                        <TabPanel>
                            <GestionPeriodos />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Container>
    );
}
