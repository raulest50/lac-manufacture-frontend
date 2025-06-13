import MyHeader from "../../components/MyHeader";
import {Container} from "@chakra-ui/react";
import AsistenteIngresoMercancia from "./AsistenteIngresoOCM/AsistenteIngresoMercancia";


export default function RecibirMercanciaPage(){

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ingreso a Almacen'}/>
                <AsistenteIngresoMercancia/>
        </Container>
    )
}
