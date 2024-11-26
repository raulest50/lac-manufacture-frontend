

import {
    Container, Flex,
}
    from "@chakra-ui/react";


import MyHeader from "../../components/MyHeader.tsx";
import WorkLoad from "./WorkLoad.tsx";


function Responsable_1(){


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Lider Responsable: 1'} />
            <Flex direction={'column'} justifyContent={'space-between'}>
                <WorkLoad responsableId={1}/>
            </Flex>
        </Container>
    );
}

export default Responsable_1;