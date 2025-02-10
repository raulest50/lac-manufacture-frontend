// src/pages/Home.tsx
import {SimpleGrid, Flex, Heading, Button, Spacer, Container, Text, Box} from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";
import { PiDownloadDuotone } from "react-icons/pi";
import { BsDatabaseCheck } from "react-icons/bs";
import { AiOutlineAudit } from "react-icons/ai";
import { FaIndustry } from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import { GiBuyCard } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { FaTruckRampBox } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";

import '@fontsource-variable/comfortaa'

import {role_master, role_jefe_prod, role_compras, role_asist_prod, role_almacen} from "../pages/Usuarios/types.tsx";


import { useAuth } from '../context/AuthContext';

export default function Home(){
    // pull out user, roles, logout from auth context
    const { user, roles, logout } = useAuth();

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']}>
            <Flex pb={'0.2em'} direction={'row'} mb={'1em'} borderBottom={'0.04em solid'}>
                <Spacer flex={1}/>
                <Heading flex={2} as={'h2'} size={'xl'} fontFamily={'Comfortaa Variable'}>
                    Inicio
                </Heading>
                <Spacer flex={2}/>
                <Box
                    transform="skewX(-20deg)" // Skews the entire outer box
                    pl="1em"
                    pr="1em"
                    mr="2em"
                    backgroundColor="green.200"
                    alignContent={'center'}
                >
                    <Box transform="skewX(10deg)"> {/* Counter-skews the content */}
                        <Text as="h3" size="xl" fontFamily="Comfortaa Variable">
                            Usuario: {user}
                        </Text>
                    </Box>
                </Box>
                <Button
                    flex={1}
                    size={'lg'}
                    colorScheme={'green'}
                    variant={'ghost'}
                    onClick={logout}
                >
                    Cerrar Sesion
                </Button>
            </Flex>

            <SimpleGrid columns={[1,1,2,3,4]} gap={'0.5em'} rowGap={'1.5em'}>
                <SectionCard to={"/usuarios"}         name={"Roles y Usuarios"}     icon={FaUsersGear}          supportedRoles={[role_master]} currentRoles={roles}/>
                <SectionCard to={'/producto'}         name={'Codificar Materiales y Productos'}  icon={PiDownloadDuotone}    supportedRoles={[role_master]} currentRoles={roles}/>
                <SectionCard to={'/produccion'}       name={'Gestion de Produccion'}           icon={AiOutlineAudit}       supportedRoles={[role_master, role_jefe_prod]} currentRoles={roles}/>
                <SectionCard to={'/stock'}            name={'Stock'}                icon={BsDatabaseCheck}      supportedRoles={[role_master, role_jefe_prod, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/Proveedores'}      name={'Proveedores'}          icon={FaIndustry}           supportedRoles={[role_master, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/compras'}          name={'Compras'}              icon={GiBuyCard}            supportedRoles={[role_master, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/informes'}         name={'Informes'}             icon={TbReportSearch}       supportedRoles={[role_master, role_compras, role_jefe_prod]} currentRoles={roles}/>
                <SectionCard to={'/asistente_produccion'}    name={'Reporte Progreso en Procesos de Produccion'} icon={GiChemicalDrop}     supportedRoles={[role_master, role_asist_prod]} currentRoles={roles}/>
                <SectionCard to={'/recepcion_mprima'} name={'Ingreso Mercancia'} icon={FaTruckRampBox}          supportedRoles={[role_master, role_almacen]} currentRoles={roles}/>
            </SimpleGrid>
        </Container>
    );
}
