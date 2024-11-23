

import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";


function Responsable_1(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Lider Responsable: 1'} />

        </Container>
    );
}

export default Responsable_1;