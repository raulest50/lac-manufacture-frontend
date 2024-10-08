

import {
    Container,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import WorkLoadList from "../components/WorkLoadList.tsx";



function MarmitasZona4(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Seccion: Marmitas 3er Piso'} />
            <WorkLoadList zonaId={304} >
            </WorkLoadList>
        </Container>
    );
}

export default MarmitasZona4;