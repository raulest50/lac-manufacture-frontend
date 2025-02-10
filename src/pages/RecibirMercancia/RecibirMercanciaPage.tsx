import MyHeader from "../../components/MyHeader.tsx";
import {Container} from "@chakra-ui/react";
import AsistenteIngresoMercancia from "./AsistenteIngresoMercancia.tsx";


export default function RecibirMercanciaPage(){
    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ingreso a Almacen'}/>
                <AsistenteIngresoMercancia/>
        </Container>
    )
}

