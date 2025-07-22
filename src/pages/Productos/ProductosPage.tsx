
import { useState, useEffect } from 'react';
import { Container, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EndPointsURL from '../../api/EndPointsURL';

import MyHeader from '../../components/MyHeader.tsx';
import { my_style_tab } from '../../styles/styles_general.tsx';

import CodificarMaterialesTab from './CodificarMaterialesTab.tsx';
import CodificarSemioTermiTab from "./CodificarSemioTermiTab/CodificarSemioTermiTab.tsx";
import InformeProductosTab from './InformeProductosTab.tsx';
import {Authority, WhoAmIResponse} from "../../api/global_types.tsx";
import {FamiliasTab} from "./FamiliasTab.tsx";


function ProductosPage() {
    const [productosAccessLevel, setProductosAccessLevel] = useState<number>(0);
    const { user } = useAuth();
    const endPoints = new EndPointsURL();

    useEffect(() => {
        const fetchUserAccessLevel = async () => {
            try {
                const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
                const authorities = response.data.authorities;

                // Buscar la autoridad para el módulo PRODUCTOS
                const productosAuthority = authorities.find(
                    (auth:Authority) => auth.authority === "ACCESO_PRODUCTOS"
                );

                // Si se encuentra, establecer el nivel de acceso
                if (productosAuthority) {
                    setProductosAccessLevel(parseInt(productosAuthority.nivel));
                }
            } catch (error) {
                console.error("Error al obtener el nivel de acceso:", error);
            }
        };

        fetchUserAccessLevel();
    }, []);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <MyHeader title="Productos" />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    {/* Solo mostrar las pestañas de creación si el usuario es master o tiene nivel 2 o superior */}
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}>Codificar Material</Tab>
                    )}

                    <Tab sx={my_style_tab}>Consulta</Tab>

                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                    )}

                    { (user === 'master' || productosAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}>Familias</Tab>
                    )}

                </TabList>

                <TabPanels>
                    {/* Solo renderizar los paneles de creación si el usuario es master o tiene nivel 2 o superior */}
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <TabPanel>
                            <CodificarMaterialesTab />
                        </TabPanel>
                    )}
                    <TabPanel>
                        <InformeProductosTab />
                    </TabPanel>
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <TabPanel>
                            <CodificarSemioTermiTab />
                        </TabPanel>
                    )}

                    { (user === 'master' || productosAccessLevel >= 2) && (
                        <TabPanel>
                            <FamiliasTab />
                        </TabPanel>
                    )}

                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default ProductosPage;
