import {SimpleGrid, Flex, Heading, Button, Spacer, Container} from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";

import {PiDownloadDuotone} from "react-icons/pi";
import {BsDatabaseCheck} from "react-icons/bs";
import {AiOutlineAudit} from "react-icons/ai";
//import {MdOutlineSdCardAlert} from "react-icons/md";
//import {IoMdAnalytics} from "react-icons/io";
//import { AiOutlineMonitor } from "react-icons/ai";
//import { RiFilterFill } from "react-icons/ri";
//import { FaFireBurner } from "react-icons/fa6";
//import { GiCardPickup } from "react-icons/gi";

import { FaIndustry } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

import '@fontsource-variable/comfortaa'


export default function Home(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']}>
            <Flex pb={'0.2em'} direction={'row'} mb={'1em'} borderBottom={'0.04em solid'}>
                <Spacer flex={1}/>
                <Heading flex={2} as={'h2'} size={'xl'} fontFamily={'Comfortaa Variable'}>Panel</Heading>
                <Spacer flex={3}/>
                <Button flex={1} size={'lg'} colorScheme={'green'} variant={'ghost'} > Cerrar Sesion </Button>
            </Flex>
            <SimpleGrid columns={[1,1,2,3,4]} gap={'0.5em'} rowGap={'1.5em'} >
                <SectionCard to={'/producto'} name={'Codificar Productos'} icon={PiDownloadDuotone} />
                <SectionCard to={'/produccion'} name={'Produccion'} icon={AiOutlineAudit} />
                <SectionCard to={'/stock'} name={'Stock'} icon={BsDatabaseCheck} />
                <SectionCard to={'/proveedores'} name={'Proveedores'} icon={FaIndustry} />
                <SectionCard to={'/bodega_zona1'} name={'Responsable 1 Produccion'} icon={IoPerson} />
                <SectionCard to={'/envasado_zona2'} name={'Responsable 2 Produccion'} icon={IoPerson} />

                {/*<SectionCard to={'/bodega_zona1'} name={'Zona Bodega 1'} icon={GiCardPickup} />
                <SectionCard to={'/envasado_zona2'} name={'Zona Llenado 2'} icon={RiFilterFill} />
                <SectionCard to={'/marmitas_zona3'} name={'Zona Marmitas 3'} icon={FaFireBurner} />*/}
                {/*<SectionCard to={'/clientes'} name={'Clientes'} icon={IoPerson} />*/}


            </SimpleGrid>
        </Container>
    );
}
