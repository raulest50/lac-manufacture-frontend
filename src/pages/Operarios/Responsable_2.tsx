

import {
    Container, Flex,
}
    from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import WorkLoad from "./WorkLoad.tsx";

function Responsable_2(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Lider Responsable: 2'} />
            <Flex direction={'column'} justifyContent={'space-between'}>
                <WorkLoad responsableId={2}/>
            </Flex>
        </Container>
    );
}

export default Responsable_2;