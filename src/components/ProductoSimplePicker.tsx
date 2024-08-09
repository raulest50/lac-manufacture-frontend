
import {useState} from 'react';

import {
    Flex,
    ListItem, List,
    Button, Text,
}
from "@chakra-ui/react";


import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {Producto} from "../models/Producto.tsx";


const styleFlex = {
    padding:'1em',
    ':hover':{
        bg:'teal.200'
    },
};



interface ProductoSimplePickerProps{
    onClickProducto: (producto:Producto) => void,
}

function ProductoSimplePicker({onClickProducto, }:ProductoSimplePickerProps){
    
    const [listaProductos, setListaProductos] = useState<Producto[]>([]);
    
    const FetchAllProductos = async () => {
        SpringRequestHandler.FetchAllProducts(setListaProductos);
    };
    
    
    return(
        <Flex direction={'column'}>
            <Button m={5} colorScheme={'teal'}
                onClick ={FetchAllProductos}
            >
                Cargar Productos
            </Button>
            <List spacing={'0.5em'}>
                {listaProductos.map((p:Producto) => (
                    <ListItem key={p.productoId} onClick={() => onClickProducto(p)}>
                        <Flex
                            direction={'row'}
                            sx={styleFlex}
                        >
                            <Text>Nombre: {p.nombre} -  </Text>
                            <Text>Id: {p.productoId} -  </Text>
                            <Text>Und: {p.tipoUnidades} -  </Text>
                            <Text>Cant: {p.cantidadUnidad} </Text>
                        </Flex>
                    </ListItem>
                ))}
            </List>
        </Flex>
    )
}

export default ProductoSimplePicker;