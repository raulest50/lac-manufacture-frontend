

import {Heading, Button} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";

export default function Seguimiento(){
    return(
        <>
        <Heading> Seguimiento </Heading>
        <NavLink to={'/'}>
            <Button>Atras</Button>
        </NavLink>
        </>
    );
}