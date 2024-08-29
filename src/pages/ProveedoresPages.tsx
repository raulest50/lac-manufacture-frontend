

import {
    Container,
}
from "@chakra-ui/react";


import MyHeader from "../components/MyHeader.tsx";



function ProveedoresPage(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Proveedores'} />

        </Container>
    );
}

export default ProveedoresPage;