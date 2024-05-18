

import {
    Heading, Button,
    SimpleGrid, 
}
from "@chakra-ui/react";

import {NavLink} from "react-router-dom";


import {PiDownloadDuotone} from "react-icons/pi";
//import {RiTimelineView} from "react-icons/ri";
import {BsDatabaseCheck} from "react-icons/bs";
import {AiOutlineAudit} from "react-icons/ai";
//import {IoFileTrayFullOutline} from "react-icons/io5";
import {MdOutlineSdCardAlert} from "react-icons/md";
import {IoMdAnalytics} from "react-icons/io";

import SectionCard from "../components/SectionCard.tsx";

export default function Seguimiento(){
    return(
        <>
        {/*<Container>*/}
        <Heading> Seguimiento </Heading>
        <NavLink to={'/'}>
            <Button>Atras</Button>
        </NavLink>
            
            <SimpleGrid columns={[1,1,2,3,4]} gap={'0.5em'} >
                <SectionCard to={'/producto'} name={'Codificar Producto'} icon={PiDownloadDuotone} />
                <SectionCard to={'/seguimiento'} name={'Crear Orden de Produccion'} icon={AiOutlineAudit} />
                <SectionCard to={'/seguimiento'} name={'Stock'} icon={BsDatabaseCheck} />
                <SectionCard to={'/seguimiento'} name={'Alertas'} icon={MdOutlineSdCardAlert} />
                <SectionCard to={'/seguimiento'} name={'Analitica'} icon={IoMdAnalytics} />
            </SimpleGrid>
            
{/*//        </Container>*/}
        </>
    );
}