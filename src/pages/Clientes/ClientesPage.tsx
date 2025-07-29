import { useState, useEffect } from 'react';
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import { my_style_tab } from "../../styles/styles_general.tsx";
import CodificarCliente from "./CodificarCliente.tsx";
import { ConsultarClientes } from "./consultar/ConsultarClientes.tsx";
import axios from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";
import { useAuth } from "../../context/AuthContext";
import { Authority } from "../../api/global_types.tsx";

const ClientesPage: React.FC = () => {
    const [clientesAccessLevel,setClientesAccessLevel]=useState(0);
    const {user}=useAuth();
    const endPoints=new EndPointsURL();

    useEffect(()=>{
        const fetchLevel=async()=>{
            try{
                const resp=await axios.get(endPoints.whoami);
                const auths:Authority[]=resp.data.authorities;
                const cAuth=auths.find(a=>a.authority==='ACCESO_CLIENTES');
                if(cAuth) setClientesAccessLevel(parseInt(cAuth.nivel));
            }catch(e){console.error(e);}
        };
        fetchLevel();
    },[]);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Gestión de Clientes'} />
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    {(user==='master' || clientesAccessLevel>=2) && (
                        <Tab sx={my_style_tab}>Registrar Cliente</Tab>
                    )}
                    <Tab sx={my_style_tab}>Consultar Clientes</Tab>
                </TabList>
                <TabPanels>
                    {(user==='master' || clientesAccessLevel>=2) && (
                        <TabPanel>
                            <CodificarCliente />
                        </TabPanel>
                    )}
                    <TabPanel>
                        <ConsultarClientes />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
};

export default ClientesPage;
