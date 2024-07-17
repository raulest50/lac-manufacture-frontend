

import {
    Container,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import {NavLink} from "react-router-dom";



function MarmitasZona3(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl', 'container.2xl', 'container.3xl']}>
            <MyHeader title={'Seccion: Marmitas 3er Piso'} />
            <NavLink to={'/'}>

            </NavLink>
        </Container>
    );
}

export default MarmitasZona3;