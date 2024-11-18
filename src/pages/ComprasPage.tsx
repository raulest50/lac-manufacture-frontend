


import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";



function ComprasPage(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Compras'} />

        </Container>
    );
}

export default ComprasPage;