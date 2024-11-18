

import {
    Container,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import WorkLoadList from "../components/WorkLoadList.tsx";



function Responsable_2(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Lider Responsable: 2'} />
            <WorkLoadList zonaId={202} >
            </WorkLoadList>
        </Container>
    );
}

export default Responsable_2;