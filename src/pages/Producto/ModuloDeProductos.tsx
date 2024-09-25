

import MyHeader from '../../components/MyHeader.tsx'



import {
    Container,
    Tab, TabList, Tabs, TabPanels, TabPanel,
} from '@chakra-ui/react'

/*
import { IoCubeSharp } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";

import { MdWaterDrop } from "react-icons/md"; // L
import { FaHashtag } from "react-icons/fa6"; // U
import { GiWeight } from "react-icons/gi";  // KG
*/



// Supports weights 100-900
import '@fontsource-variable/league-spartan';
import '@fontsource/anton';

import {my_style_tab} from "../../styles/styles_general.tsx";

import SubModuloRecetas from "./SubModuloRecetas.tsx";
import BandejaCodificacion from "./BandejaCodificacion.tsx";


// import {MiItem, Insumo, MateriaPrima, CrearProductoHelper} from "./CrearProductoHelper.tsx";


// import {TIPOS_PRODUCTOS, UNIDADES, SECCION} from "../../models/constants.tsx";

function ModuloDeProductos(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Codificar Producto'}/>
            <Tabs isFitted gap={'1em'} variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Materia Prima</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                </TabList>
                
                <TabPanels>
                    <TabPanel >
                        <BandejaCodificacion/>
                    </TabPanel>

                    <TabPanel>
                        <SubModuloRecetas/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
        
    );
}

export default ModuloDeProductos;