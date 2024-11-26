import {SimpleGrid, Flex, Heading, Button, Spacer, Container} from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";

import {PiDownloadDuotone} from "react-icons/pi";
import {BsDatabaseCheck} from "react-icons/bs";
import {AiOutlineAudit} from "react-icons/ai";

import { FaIndustry } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { GiBuyCard } from "react-icons/gi";

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
                <SectionCard to={'/responsable_1'} name={'Responsable 1 Produccion'} icon={IoPerson} />
                <SectionCard to={'/responsable_2'} name={'Responsable 2 Produccion'} icon={IoPerson} />
                <SectionCard to={'/compras'} name={'Compras'} icon={GiBuyCard} />

            </SimpleGrid>
        </Container>
    );
}
