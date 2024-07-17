

import {
    Container,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import {NavLink} from "react-router-dom";



function Stock(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl', 'container.2xl', 'container.3xl']}>
            <MyHeader title={'Movimientos y Stock'} />
            <NavLink to={'/'}>

            </NavLink>
        </Container>
    );
}

export default Stock;