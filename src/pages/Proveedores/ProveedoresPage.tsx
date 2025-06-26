
import { useState, useEffect } from 'react';
import {
    Container, Tab, TabList, TabPanel, TabPanels, Tabs,
} from "@chakra-ui/react";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EndPointsURL from '../../api/EndPointsURL';

import MyHeader from "../../components/MyHeader.tsx";
import {my_style_tab} from "../../styles/styles_general.tsx";
import CodificarProveedor from "./CodificarProveedor.tsx";
import {ConsultarProveedores} from "./consultar/ConsultarProveedores.tsx";

// Interfaz para las autoridades del usuario
interface Authority {
    authority: string;
    nivel: string;
}

// Interfaz para la respuesta del endpoint whoami
interface WhoAmIResponse {
    authorities: Authority[];
}

function ProveedoresPage() {
    const [proveedoresAccessLevel, setProveedoresAccessLevel] = useState<number>(0);
    const { user } = useAuth();
    const endPoints = new EndPointsURL();

    useEffect(() => {
        const fetchUserAccessLevel = async () => {
            try {
                const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
                const authorities = response.data.authorities;

                // Buscar la autoridad para el módulo PROVEEDORES
                const proveedoresAuthority = authorities.find(
                    auth => auth.authority === "ACCESO_PROVEEDORES"
                );

                // Si se encuentra, establecer el nivel de acceso
                if (proveedoresAuthority) {
                    setProveedoresAccessLevel(parseInt(proveedoresAuthority.nivel));
                }
            } catch (error) {
                console.error("Error al obtener el nivel de acceso:", error);
            }
        };

        fetchUserAccessLevel();
    }, []);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Registrar Proveedor'} />

            <Tabs>
                <TabList>
                    {/* Solo mostrar la pestaña de codificar si el usuario es master o tiene nivel 2 o superior */}
                    {(user === 'master' || proveedoresAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}> Codificar Proveedor </Tab>
                    )}
                    <Tab sx={my_style_tab}> Consultar Proveedores </Tab>
                </TabList>

                <TabPanels>
                    {/* Solo renderizar el panel de codificar si el usuario es master o tiene nivel 2 o superior */}
                    {(user === 'master' || proveedoresAccessLevel >= 2) && (
                        <TabPanel>
                            <CodificarProveedor/>
                        </TabPanel>
                    )}

                    <TabPanel>
                        <ConsultarProveedores />
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default ProveedoresPage;
