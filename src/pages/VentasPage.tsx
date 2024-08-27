


import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";



function VentasPage(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Clientes'} />

        </Container>
    );
}

export default VentasPage;