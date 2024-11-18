


import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../../components/MyHeader.tsx";



function ComprasMain(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Compras'} />

        </Container>
    );
}

export default ComprasMain;