// src/pages/Home.tsx
import { SimpleGrid, Flex, Heading, Button, Spacer, Container, Text } from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";
import { PiDownloadDuotone } from "react-icons/pi";
import { BsDatabaseCheck } from "react-icons/bs";
import { AiOutlineAudit } from "react-icons/ai";
import { FaIndustry } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
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
                    Panel
                </Heading>
                <Spacer flex={2}/>
                <Text as={'h3'} size={'xl'} fontFamily={'Comfortaa Variable'}> Rol: {user} </Text>
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
                <SectionCard to={'/producto'}         name={'Codificar Productos'}  icon={PiDownloadDuotone}    supportedRoles={[role_master]} currentRoles={roles}/>
                <SectionCard to={'/produccion'}       name={'Produccion'}           icon={AiOutlineAudit}       supportedRoles={[role_master, role_jefe_prod]} currentRoles={roles}/>
                <SectionCard to={'/stock'}            name={'Stock'}                icon={BsDatabaseCheck}      supportedRoles={[role_master, role_jefe_prod, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/Proveedores'}      name={'Proveedores'}          icon={FaIndustry}           supportedRoles={[role_master, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/compras'}          name={'Compras'}              icon={GiBuyCard}            supportedRoles={[role_master, role_compras]} currentRoles={roles}/>
                <SectionCard to={'/informes'}         name={'Informes'}             icon={TbReportSearch}       supportedRoles={[role_master, role_compras, role_jefe_prod]} currentRoles={roles}/>
                <SectionCard to={'/responsable_1'}    name={'Responsable 1 ProduccionPage'} icon={IoPerson}     supportedRoles={[role_master, role_asist_prod]} currentRoles={roles}/>
                <SectionCard to={'/responsable_2'}    name={'Responsable 2 ProduccionPage'} icon={IoPerson}     supportedRoles={[role_master]} currentRoles={roles}/>
                <SectionCard to={'/recepcion_mprima'} name={'Ingreso Mercancia'} icon={FaTruckRampBox}          supportedRoles={[role_master, role_almacen]} currentRoles={roles}/>
            </SimpleGrid>
        </Container>
    );
}
