

import {Card, CardHeader, CardBody, Heading, Icon} from "@chakra-ui/react";
import {IconType} from "react-icons";



import {NavLink} from "react-router-dom";


const my_sc_style={
    p:'2em',
    m:'1em',
    bg:'blue.100',
    
    ':hover':{
        bg:'blue.300'
    },
    ':active':{
        bg:'blue.800'
    },
}

interface SectionCardProps{
    name: string;
    icon: IconType;
    to: string;
}

function SectionCard({name, icon, to}:SectionCardProps){
    return(
        
        <NavLink to={to}>
            <Card h={'full'} sx={my_sc_style}>
                <CardHeader h={'40%'} borderBottom='0.1em solid' alignContent={'center'}>
                    <Heading as={'h2'} size={'sm'} fontFamily={'Comfortaa Variable'} >{name}</Heading>
                </CardHeader>
                <CardBody >
                    <Icon boxSize={'4em'} as={icon} />
                </CardBody>
            </Card>
        </NavLink>
    )
}

export default SectionCard