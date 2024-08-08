

import {
    Container,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import WorkLoadList from "../components/WorkLoadList.tsx";



function EnvasadoZona2(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Seccion: Envasado 2do Piso'} />
            <WorkLoadList zonaId={2} >
            </WorkLoadList>
        </Container>
    );
}

export default EnvasadoZona2;