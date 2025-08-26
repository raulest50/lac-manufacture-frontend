import MyHeader from "../../components/MyHeader";
import {Container, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import AsistenteIngresoMercancia from "./AsistenteIngresoOCM/AsistenteIngresoMercancia";
import {AsistenteDispensacion} from "./AsistenteDispensacion/AsistenteDispensacion.tsx";
import {AsistenteDispensacionDirecta} from "./AsistenteDispensacionDirecta/AsistenteDispensacionDirecta.tsx";
import {AsistenteBackflushDirecto} from "./AsistenteBackflushDirecto/AsistenteBackflushDirecto.tsx";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL";
import { useAuth } from "../../context/AuthContext";


export default function TransaccionesAlmacenPage(){
    const [showDispensacionDirecta, setShowDispensacionDirecta] = useState(false);
    const [showBackflushDirecto, setShowBackflushDirecto] = useState(false);
    const { user } = useAuth();
    const endPoints = useMemo(() => new EndPointsURL(), []);

    useEffect(() => {
        if (!user) return;

        const fetchDirective = async (nombre: string) => {
            try {
                const res = await axios.get<{ valor: string }>(endPoints.get_master_directive(nombre));
                return res.data.valor;
            } catch (error) {
                console.error(`Error fetching directive ${nombre}`, error);
                return null;
            }
        };

        const loadDirectives = async () => {
            const disp = await fetchDirective("Permitir Consumo No Planificado");
            const back = await fetchDirective("Permitir Backflush No Planificado");
            setShowDispensacionDirecta(disp === "true");
            setShowBackflushDirecto(back === "true");
        };

        loadDirectives();
    }, [user, endPoints]);

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ingreso a Almacen'}/>
            <Tabs>
                <TabList>
                    <Tab> Ingreso OCM </Tab>
                    <Tab> Dispensacion </Tab>
                    <Tab> Ingreso Producto Terminado </Tab>
                    {showDispensacionDirecta && <Tab> Dispensacion Directa </Tab>}
                    {showBackflushDirecto && <Tab> Backflush Directo </Tab>}
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

                    {showDispensacionDirecta && (
                        <TabPanel>
                            <AsistenteDispensacionDirecta />
                        </TabPanel>
                    )}

                    {showBackflushDirecto && (
                        <TabPanel>
                            <AsistenteBackflushDirecto />
                        </TabPanel>
                    )}

                </TabPanels>
            </Tabs>
        </Container>
    )
}
