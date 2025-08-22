import MyHeader from "../../components/MyHeader";
import {Container, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import AsistenteIngresoMercancia from "./AsistenteIngresoOCM/AsistenteIngresoMercancia";
import {AsistenteDispensacion} from "./AsistenteDispensacion/AsistenteDispensacion.tsx";
import {AsistenteDispensacionDirecta} from "./AsistenteDispensacionDirecta/AsistenteDispensacionDirecta.tsx";
import {AsistenteBackflushDirecto} from "./AsistenteBackflushDirecto/AsistenteBackflushDirecto.tsx";


export default function TransaccionesAlmacenPage(){

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ingreso a Almacen'}/>
            <Tabs>
                <TabList>
                    <Tab> Ingreso OCM </Tab>
                    <Tab> Dispensacion </Tab>
                    <Tab> Ingreso Producto Terminado </Tab>
                    <Tab> Dispensacion Directa (provisional) </Tab>
                    <Tab> Backflush Directo (provisional) </Tab>
                </TabList>
                <TabPanels>

                    <TabPanel>
                        <AsistenteIngresoMercancia/>
                    </TabPanel>

                    <TabPanel>
                        <AsistenteDispensacion />
                    </TabPanel>

                    <TabPanel>
                        <AsistenteIngresoMercancia />
                    </TabPanel>

                    <TabPanel>
                        <AsistenteDispensacionDirecta />
                    </TabPanel>

                    <TabPanel>
                        <AsistenteBackflushDirecto />
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Container>
    )
}
