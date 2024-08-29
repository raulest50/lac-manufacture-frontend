

import {useState} from 'react';

import {
    Flex, Box, HStack, VStack,
    ListItem, List,
    Button, Text,
    Card, CardHeader, CardBody, CardFooter,
    IconButton,
}
from "@chakra-ui/react";


import { MdDone } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";


import {OrdenSeguimiento} from "../models/OrdenSeguimiento.tsx";
import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {OrdenProduccion} from "../models/OrdenProduccion.tsx";


interface WorkLoadListProps{
    zonaId: number,
}

function WorkLoadList({zonaId, }:WorkLoadListProps){
    
    const [listaOrdenesSeg, setListaOrdenesSeg] = useState<OrdenSeguimiento[]>([]);
    
    const [listaOrdenesProd, setListaOrdenesProd] = useState<OrdenProduccion[]>([]);

    const ActualizarWorkLoad = async () => {
        SpringRequestHandler.getWorkLoadByZona(zonaId, setListaOrdenesSeg);
        SpringRequestHandler.getOrdenesProdByZona(zonaId, setListaOrdenesProd);
    };

    const onOrdenSegClick = (ordenSeg:OrdenSeguimiento) => {
        ordenSeg;
    };

    const onOrdenProdClick = (ordenProd:OrdenProduccion) => {
        ordenProd;
    };
    
    const ActualizarEstadoOrdenSeguimiento = async (ordenSeguimientoId:number, estado:number) => {
        SpringRequestHandler.UpdateOrdenSeguimientoEstado(ordenSeguimientoId, estado)
    };
    
    
    return(
        <Flex direction={'column'} gap={'2em'}>

            <Button m={5} colorScheme={'teal'}
                onClick ={ActualizarWorkLoad}
            >
                Actualizar
            </Button>

            <List spacing={'0.5em'}>
                {listaOrdenesSeg.map((ordenSeg:OrdenSeguimiento, index) => (
                    <ListItem key={index} onClick={() => onOrdenSegClick(ordenSeg)}>
                        <Card>
                            <CardHeader>
                                <Flex direction={'row'}>
                                    <Text>ID: {ordenSeg.seguimientoId}  </Text>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <Text as={'p'}> Observaciones : {ordenSeg.observaciones} </Text>
                                <Text>Producto: {ordenSeg.insumo.producto.nombre}  </Text>
                                <Text>Cantidad: {ordenSeg.insumo.cantidadRequerida}  </Text>
                            </CardBody>

                            <CardFooter>
                                <IconButton
                                    aria-label='Toggle State'
                                    icon={ordenSeg.estado ? <MdPendingActions/> : <MdDone/>}
                                    onClick={ () =>{
                                        ordenSeg.estado ? ordenSeg.estado=1 : ordenSeg.estado=0;
                                        // Non-null Assertion Operator (!): This operator can be used to assert that an expression is non-null and non-undefined
                                        //in situations where TypeScript can’t infer that from the surrounding code.
                                        ActualizarEstadoOrdenSeguimiento(ordenSeg.seguimientoId!, ordenSeg.estado);
                                    }}
                                    fontSize={{ base: "1.2em", md: "2em", lg: "2.8m", xl:"3.5em" }}  // Responsive font size
                                    size={"lg"}
                                />
                            </CardFooter>
                        </Card>
                    </ListItem>
                ))}
            </List>

            <List spacing={'0.5em'}>
                {listaOrdenesProd.map((ordenProd:OrdenProduccion, index) => (
                    <ListItem key={index} onClick={() => onOrdenProdClick(ordenProd)}>
                        <Card>
                            <CardHeader>
                                <Flex direction={'row'}>
                                    <Text>ID: {ordenProd.ordenId}  </Text>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <Text as={'p'}> Observaciones : {ordenProd.observaciones} </Text>
                                <Text>Producto Terminado: {ordenProd.terminado.nombre}  </Text>
                            </CardBody>

                            <CardFooter>
                                <IconButton
                                    aria-label='Toggle State'
                                    icon={ordenProd.estadoOrden ? <MdPendingActions/> : <MdDone/>}
                                    onClick={ () =>{
                                        ordenProd.estadoOrden ? ordenProd.estadoOrden=1 : ordenProd.estadoOrden=0;
                                        // Non-null Assertion Operator (!): This operator can be used to assert that an expression is non-null and non-undefined
                                        // in situations where TypeScript can’t infer that from the surrounding code.
                                        // ActualizarEstadoOrdenSeguimiento(ordenSeg.seguimientoId!, ordenSeg.estado);
                                    }}
                                    fontSize={{ base: "1.2em", md: "2em", lg: "2.8m", xl:"3.5em" }}  // Responsive font size
                                    size={"lg"}
                                />
                            </CardFooter>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Flex>
    )
}

export default WorkLoadList;