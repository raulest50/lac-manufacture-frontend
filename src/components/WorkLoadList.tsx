

import {useState} from 'react';

import {
    Flex, Box,
    ListItem, List,
    Button, Text,
    Card, CardHeader, CardBody, CardFooter,
    IconButton, useDisclosure
}
from "@chakra-ui/react";


import { MdDone } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";


import {OrdenSeguimiento} from "../models/OrdenSeguimiento.tsx";
import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {OrdenProduccion} from "../models/OrdenProduccion.tsx";

import ModalConfirmation from "../components/ModalConfirmation.tsx";

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
    
    
    const { isOpen, onOpen, onClose } = useDisclosure();


    return(
        <Flex direction={'column'} gap={'2em'}>

            <Button m={5} colorScheme={'teal'}
                onClick ={ActualizarWorkLoad}
            >
                Actualizar
            </Button>

            <List spacing={'0.5em'}>
                <Text> {listaOrdenesSeg.length > 0 ? "Lista Ordenes Seguimiento:" : ""} </Text>
                {listaOrdenesSeg.map((ordenSeg:OrdenSeguimiento, index) => (
                    <ListItem key={index} onClick={() => onOrdenSegClick(ordenSeg)}>
                        <Card>
                            <CardHeader>
                                <Flex direction={'row'} gap={'1em'}>
                                    <Text fontSize={"xl"} >ID Orden Seguimiento: {ordenSeg.seguimientoId}  </Text>
                                    <Text fontSize={"xl"}>{ordenSeg.insumo.producto.tipo_producto == 'M' ? "Materia Prima" : "Semiterminado"} : {ordenSeg.insumo.producto.nombre}  </Text>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <Flex direction={'row'} gap={'1em'}>

                                    <Flex direction={'column'} flex={1} gap={'1em'} sx={{bgColor:'cyan.200'}}>
                                        <Box>
                                            <Text> Creacion Orden de Produccion: </Text>
                                            <Text> Fecha: {ordenSeg.fechaInicio!.split('T')[0]} </Text>
                                            <Text> Hora: {ordenSeg.fechaInicio!.split('T')[1].split('.')[0]} </Text>
                                        </Box>
                                        <Text>Cantidad: {ordenSeg.insumo.cantidadRequerida}  </Text>
                                    </Flex>

                                    <Flex direction={'column'} flex={3} gap={'1em'} sx={{bgColor:'green.200'}} >
                                        <Text as={'p'}> Observaciones : {ordenSeg.observaciones} </Text>
                                    </Flex>

                                </Flex>

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
                <Text> {listaOrdenesProd.length > 0 ? "Lista Ordenes Produccion:" : ""} </Text>
                {listaOrdenesProd.map((ordenProd:OrdenProduccion, index) => (
                    <ListItem key={index} onClick={() => onOrdenProdClick(ordenProd)}>
                        <Card>
                            <CardHeader>
                                <Flex direction={'row'} gap={'2em'}>
                                    <Text fontSize={'xl'} >ID de Orden de Produccion: {ordenProd.ordenId} </Text>
                                    <Text as={'h2'} fontSize={'xl'} > Producto Terminado: {ordenProd.terminado.nombre} </Text>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <Flex direction={'row'} gap={10}>
                                    <Flex direction={'column'} flex={1} sx={{bgColor:'teal.200'}} gap={'.2em'}>
                                        <Text> Creacion Orden de Produccion: </Text>
                                        <Text> Fecha: {ordenProd.fechaInicio.split('T')[0]} </Text>
                                        <Text> Hora: {ordenProd.fechaInicio.split('T')[1].split('.')[0]} </Text>
                                    </Flex>

                                    <Flex direction={'column'} flex={3} sx={{bgColor:'pink.200'}} >
                                        <Text as={'p'}> Observaciones : {ordenProd.observaciones} </Text>
                                    </Flex>
                                </Flex>
                                <List>
                                    {ordenProd.ordenesSeguimiento.map((ordenSeg:OrdenSeguimiento, index) => (
                                        <ListItem key={index} >
                                            <Text>{ordenSeg.insumo.producto.nombre} - {ordenSeg.estado}</Text>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardBody>

                            <CardFooter>
                                <IconButton
                                    aria-label='Toggle State'
                                    icon={ordenProd.estadoOrden ? <MdPendingActions/> : <MdDone/>}
                                    onClick={ () =>{
                                        //ordenProd.estadoOrden ? ordenProd.estadoOrden=1 : ordenProd.estadoOrden=0;

                                        onOpen();

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

            <ModalConfirmation onClose={onClose} isOpen={isOpen} />
        </Flex>
    )
}

export default WorkLoadList;