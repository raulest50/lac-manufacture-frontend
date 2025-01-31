
import {Flex, FormControl, FormLabel, Input} from "@chakra-ui/react";
//import {useState} from "react";


export default function CrearOrdenCompra(){

    //const [proveedor, setProveedor] = useState()


    return(
        <Flex direction={"column"} p={0} m={0} w={'full'} h={'full'}>
            <FormControl>
                <FormLabel>proveedor:</FormLabel>
                <Input

                />
            </FormControl>
        </Flex>
    )
}