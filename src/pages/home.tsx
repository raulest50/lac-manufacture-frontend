import {SimpleGrid, Flex, Heading, Button, Spacer} from "@chakra-ui/react";
import SectionCard from "./SectionCard.tsx";

import {PiDownloadDuotone} from "react-icons/pi";
import {RiTimelineView} from "react-icons/ri";
import {BsDatabaseCheck} from "react-icons/bs";
import {AiOutlineAudit} from "react-icons/ai";
import {IoFileTrayFullOutline} from "react-icons/io5";
import {MdOutlineSdCardAlert, MdAssignmentAdd} from "react-icons/md";
import {IoMdAnalytics} from "react-icons/io";

import '@fontsource-variable/comfortaa'


export default function Home(){
    return(
        <>
        <Flex pb={'0.2em'} direction={'row'} mb={'1em'} borderBottom={'0.04em solid'}>
            <Heading flex={2} as={'h2'} size={'xl'} fontFamily={'Comfortaa Variable'}>Panel</Heading>
            <Spacer flex={3}/>
            <Button flex={1} size={'lg'} colorScheme={'green'} variant={'ghost'} > Cerrar Sesion </Button>
        </Flex>
        <SimpleGrid columns={3} gap={'0.5em'} >
            <SectionCard to={'/seguimiento'} name={'Registrar Formula'} icon={PiDownloadDuotone} />
            <SectionCard to={'/seguimiento'} name={'Seguimiento'} icon={AiOutlineAudit} />
            <SectionCard to={'/seguimiento'} name={'Stock'} icon={BsDatabaseCheck} />
            <SectionCard to={'/seguimiento'} name={'Alertas'} icon={MdOutlineSdCardAlert} />
            <SectionCard to={'/seguimiento'} name={'Analitica'} icon={IoMdAnalytics} />
            
        </SimpleGrid>
        </>
    );
}
