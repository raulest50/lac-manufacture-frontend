import {SimpleGrid, Flex, Heading, Button, Spacer, Container} from "@chakra-ui/react";
import SectionCard from "../components/SectionCard.tsx";

import {PiDownloadDuotone} from "react-icons/pi";
//import {RiTimelineView} from "react-icons/ri";
import {BsDatabaseCheck} from "react-icons/bs";
import {AiOutlineAudit} from "react-icons/ai";
//import {IoFileTrayFullOutline} from "react-icons/io5";
import {MdOutlineSdCardAlert} from "react-icons/md";
import {IoMdAnalytics} from "react-icons/io";

import '@fontsource-variable/comfortaa'


export default function Home(){
    return(
        <Container maxW={'90wv'}>
            <Flex pb={'0.2em'} direction={'row'} mb={'1em'} borderBottom={'0.04em solid'}>
                <Spacer flex={1}/>
                <Heading flex={2} as={'h2'} size={'xl'} fontFamily={'Comfortaa Variable'}>Panel</Heading>
                <Spacer flex={3}/>
                <Button flex={1} size={'lg'} colorScheme={'green'} variant={'ghost'} > Cerrar Sesion </Button>
            </Flex>
            <SimpleGrid columns={[1,1,2,3,4]} gap={'0.5em'} >
                <SectionCard to={'/producto'} name={'Codificar Producto'} icon={PiDownloadDuotone} />
                <SectionCard to={'/seguimiento'} name={'Iniciar Produccion'} icon={AiOutlineAudit} />
                <SectionCard to={'/seguimiento'} name={'Stock'} icon={BsDatabaseCheck} />
                <SectionCard to={'/seguimiento'} name={'Alertas'} icon={MdOutlineSdCardAlert} />
                <SectionCard to={'/seguimiento'} name={'Analitica'} icon={IoMdAnalytics} />
                
            </SimpleGrid>
        </Container>
    );
}
