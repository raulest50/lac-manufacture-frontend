import {Container} from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import UserFullRoleCRUD from "./UserFullRoleCRUD.tsx";


export default function UsuariosPage(){

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Roles y Usuarios'}/>
                <UserFullRoleCRUD/>
        </Container>
    );
}