import React, { useEffect, useState } from 'react';
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EndPointsURL from '../../api/EndPointsURL';
import MyHeader from "../../components/MyHeader.tsx";
import { my_style_tab } from "../../styles/styles_general.tsx";

interface Authority {
    authority: string;
    nivel: string;
}

interface WhoAmIResponse {
    authorities: Authority[];
}

const VentasPage: React.FC = () => {
    const [ventasAccessLevel, setVentasAccessLevel] = useState<number>(0);
    const { user } = useAuth();
    const endPoints = new EndPointsURL();

    useEffect(() => {
        const fetchVentasAccessLevel = async () => {
            try {
                const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
                const authorities = response.data.authorities;

                const ventasAuthority = authorities.find(
                    (auth) => auth.authority === 'ACCESO_VENTAS'
                );

                if (ventasAuthority) {
                    setVentasAccessLevel(parseInt(ventasAuthority.nivel, 10));
                }
            } catch (error) {
                console.error('Error al obtener el nivel de acceso para ventas:', error);
            }
        };

        fetchVentasAccessLevel();
    }, []);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Gestión de Ventas'} />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Venta</Tab>
                    <Tab sx={my_style_tab}>Historial de Ventas</Tab>
                    <Tab sx={my_style_tab}>Reportes</Tab>
                    {(user === 'master' || ventasAccessLevel >= 3) && (
                        <Tab sx={my_style_tab}>Crear vendedor nuevo</Tab>
                    )}
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {/* Contenido para crear ventas */}
                        <p>Formulario de registro de ventas en desarrollo.</p>
                    </TabPanel>
                    <TabPanel>
                        {/* Contenido para historial de ventas */}
                        <p>Historial de ventas en desarrollo.</p>
                    </TabPanel>
                    <TabPanel>
                        {/* Contenido para reportes */}
                        <p>Reportes de ventas en desarrollo.</p>
                    </TabPanel>
                    {(user === 'master' || ventasAccessLevel >= 3) && (
                        <TabPanel>
                            <p>Formulario para registrar nuevos vendedores próximamente.</p>
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>
        </Container>
    );
};

export default VentasPage;
