// src/pages/Home.tsx
import {SimpleGrid, Flex, Heading, Button, Spacer, Container, Text, Box} from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";
import { PiDownloadDuotone } from "react-icons/pi";
import { BsDatabaseCheck } from "react-icons/bs";
import { AiOutlineAudit } from "react-icons/ai";
import { FaIndustry } from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import { GiBuyCard } from "react-icons/gi";
// import { TbReportSearch } from "react-icons/tb";
import { FaTruckRampBox } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";
import { FaFileUpload } from "react-icons/fa";
import { TbReportMoney } from 'react-icons/tb';
import { MdOutlineInsights } from "react-icons/md";
import { FaSteam } from "react-icons/fa";
import { PiMicrosoftTeamsLogoFill } from "react-icons/pi";
import { MdNotificationsActive } from "react-icons/md";
import { FaCogs } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import '@fontsource-variable/comfortaa'

import { Modulo } from "./Usuarios/GestionUsuarios/types.tsx";

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
                <SectionCard to={"/usuarios"}         name={"Roles y Usuarios"}     icon={FaUsersGear}          supportedModules={[Modulo.USUARIOS]} currentAccesos={roles}/>
                <SectionCard to={'/producto'}         name={'Codificar Materiales y Productos'}  icon={PiDownloadDuotone}    supportedModules={[Modulo.PRODUCTOS]} currentAccesos={roles}/>
                <SectionCard to={'/produccion'}       name={'Gestion de Produccion'}           icon={AiOutlineAudit}       supportedModules={[Modulo.PRODUCCION]} currentAccesos={roles}/>
                <SectionCard to={'/stock'}            name={'Stock'}                icon={BsDatabaseCheck}      supportedModules={[Modulo.STOCK]} currentAccesos={roles}/>
                <SectionCard to={'/Proveedores'}      name={'Proveedores'}          icon={FaIndustry}           supportedModules={[Modulo.PROVEEDORES]} currentAccesos={roles}/>
                <SectionCard to={'/compras'}          name={'Compras'}              icon={GiBuyCard}            supportedModules={[Modulo.COMPRAS]} currentAccesos={roles}/>
                {/*<SectionCard to={'/informes'}         name={'Informes'}             icon={TbReportSearch}       supportedModules={[Modulo.INFORMES]} currentAccesos={roles}/>*/}
                <SectionCard to={'/asistente_produccion'}    name={'Reporte Progreso en Procesos de Produccion'} icon={GiChemicalDrop}     supportedModules={[Modulo.SEGUIMIENTO_PRODUCCION]} currentAccesos={roles}/>
                <SectionCard to={'/recepcion_mprima'} name={'Ingreso Mercancia'} icon={FaTruckRampBox} supportedModules={[Modulo.TRANSACCIONES_ALMACEN]} currentAccesos={roles}/>
                <SectionCard to={'/carga_masiva'} name={'Carga Masiva de Datos'} icon={FaFileUpload} supportedModules={[Modulo.CARGA_MASIVA]} currentAccesos={roles} bgColor="red.100"/>
                <SectionCard to={'/Activos'} name={'Activos'} icon={FaSteam}          supportedModules={[Modulo.ACTIVOS]} currentAccesos={roles}/>
                <SectionCard to={'/Contabilidad'} name={'Contabilidad'} icon={TbReportMoney}          supportedModules={[Modulo.CONTABILIDAD]} currentAccesos={roles}/>
                <SectionCard to={'/Personal'} name={'Personal'} icon={PiMicrosoftTeamsLogoFill}          supportedModules={[Modulo.PERSONAL_PLANTA]} currentAccesos={roles}/>
                <SectionCard to={'/Bintelligence'} name={'BI'} icon={MdOutlineInsights}          supportedModules={[Modulo.BINTELLIGENCE]} currentAccesos={roles}/>
                <SectionCard to={'/administracion_alertas'} name={'Administracion Alertas'} icon={MdNotificationsActive} supportedModules={[Modulo.ADMINISTRACION_ALERTAS]} currentAccesos={roles}/>
                <SectionCard to={'/master_configs'} name={'Master Config'} icon={FaCogs} supportedModules={[Modulo.MASTER_CONFIGS]} currentAccesos={roles} bgColor="red.100"/>
                <SectionCard to={'/cronograma'} name={'Cronograma'} icon={FaCalendarAlt} supportedModules={[Modulo.CRONOGRAMA]} currentAccesos={roles}/>
            </SimpleGrid>
        </Container>
    );
}
