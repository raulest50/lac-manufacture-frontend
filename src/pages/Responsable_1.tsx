

import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";
import WorkLoadList from "../components/WorkLoadList.tsx";




function Responsable_1(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Lider Responsable: 1'} />
            <WorkLoadList zonaId={101} >
            </WorkLoadList>

        </Container>
    );
}

export default Responsable_1;