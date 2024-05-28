
import {Container} from "@chakra-ui/react";
import MyHeader from '../components/MyHeader.tsx';

export default function Produccion(){
    return(
        
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={' Iniciar Orden de Produccion'}/>
            
        </Container>
    )
}
