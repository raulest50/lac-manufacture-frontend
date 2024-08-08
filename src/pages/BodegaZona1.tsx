

import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";
import WorkLoadList from "../components/WorkLoadList.tsx";




function BodegaZona1(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Seccion: Bodega 1er Piso'} />
            <WorkLoadList zonaId={1} >
            </WorkLoadList>

        </Container>
    );
}

export default BodegaZona1;