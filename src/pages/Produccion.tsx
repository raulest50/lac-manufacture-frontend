
import {useState} from 'react';
import { useToast } from '@chakra-ui/react';

import {Container, Tabs, TabList, Tab, TabPanels, TabPanel, Box, VStack, HStack,
    Flex, Button, Input, FormControl, FormLabel, Select,
    Textarea, List, ListItem, Icon,
    Card, CardBody, CardHeader, Text, Heading,
    Accordion, AccordionItem, AccordionButton, AccordionPanel,

} from "@chakra-ui/react";


import MyHeader from '../components/MyHeader.tsx';


import {my_style_tab} from "../styles/styles_general.tsx";
import {SECCION} from "../models/constants.tsx";
import {Terminado} from "../models/Terminado.tsx";
import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {OrdenProduccionDTA} from "../models/OrdenProduccionDTA.tsx";
import {OrdenProduccion} from "../models/OrdenProduccion.tsx";


const TIPO_BUSQUEDAS = {ID:'ID', NOMBRE:'NOMBRE'};


// iconos tipo de unidad de medida
import { MdWaterDrop } from "react-icons/md"; // L
import { FaHashtag } from "react-icons/fa6"; // U
import { GiWeight } from "react-icons/gi";
import {OrdenSeguimiento} from "../models/OrdenSeguimiento.tsx";  // KG


export default function Produccion(){

    const toast = useToast();

    const [tipo_search_sel, setTipoSearchSel] = useState(TIPO_BUSQUEDAS.NOMBRE);
    const [busqueda, setBusqueda] = useState('');
    const [seccion_responsable_sel, setSeccionResponsable] = useState(SECCION.BODEGA.id);
    const [observaciones, setObservaciones] = useState('');

    const [listaTerminados, setListaTerminados] = useState<Terminado[]>([]);

    const [listaOrdenesProdActiv, setListaOrdenesProdActive] = useState<OrdenProduccion[]>([]);


    const emptyTerminado:Terminado ={
        productoId:-1,
        nombre:"",
        observaciones:"",
        costo:0,
        fechaCreacion:"",
        tipoUnidades:"",
        cantidadUnidad:0,
        tipo_producto:"",
        status:0,
        seccionResponsable:-1,
        insumos:[]
    }

    const [selectedTerminado, setSelectedTerminado] = useState<Terminado>(emptyTerminado);

    const CrearOrdenProduccion = async () => {
        const ordenProduccionDTA:OrdenProduccionDTA = {
            terminadoId: selectedTerminado.productoId,
            seccionResponsable: seccion_responsable_sel,
            observaciones: observaciones,
        };
        SpringRequestHandler.CrearOrdenProduccion(toast, ordenProduccionDTA);
    }

    const UpdateOrdenesActivas = async () => {
        SpringRequestHandler.getOrdenesActivas(setListaOrdenesProdActive);
    }

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          SpringRequestHandler.getTerminadosList(busqueda, tipo_search_sel, setListaTerminados);
        }
    };

    // cuando se le da click a uno de los productos terminados, mecanismo de seleccion y deseleccion
    const onItemTerminadoClick = (terminado:Terminado) => {
        if(selectedTerminado.productoId == -1){ // esta seleccionado el terminado empty que representa no seleccion
            setSelectedTerminado(terminado);
        } else{
            if(selectedTerminado.productoId == terminado.productoId){ // se clickeo nuevamente el mismo entonces se deselecciona
                setSelectedTerminado(emptyTerminado);
            } else {
                setSelectedTerminado(terminado);
            }
        }
    };

    const get_UnitsIcon = (tipo_unidades:string) => {
        switch (tipo_unidades) {
            case 'L':
                return MdWaterDrop;
            case 'KG':
                return GiWeight;
            case 'U':
                return FaHashtag;
            default:
                return FaHashtag;
        }
    };


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Ordenes De Produccion'}/>
            
            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Crear Orden Produccion</Tab>
                    <Tab sx={my_style_tab}>Ordenes Activas</Tab>
                    <Tab sx={my_style_tab}>Historial</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex direction={'column'}>
                            <Flex align={'center'} direction={'row'}>
                                <FormControl p={'1em'}>
                                    <FormLabel>Buscar: </FormLabel>
                                    <Input
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        onKeyDown={(e) => onKeyPress_InputBuscar(e)}
                                        value={busqueda}/>
                                </FormControl>

                                <FormControl p={'1em'}>
                                    <FormLabel>Tipo Busqueda: </FormLabel>
                                    <Select
                                        value={tipo_search_sel}
                                        onChange={(e)=>setTipoSearchSel(e.target.value)}
                                    >
                                        <option value={TIPO_BUSQUEDAS.NOMBRE}>{TIPO_BUSQUEDAS.NOMBRE}</option>
                                        <option value={TIPO_BUSQUEDAS.ID}>{TIPO_BUSQUEDAS.ID}</option>
                                    </Select>
                                </FormControl>

                                <FormControl p={'1em'}>
                                    <FormLabel>Seccion Responsable: </FormLabel>
                                    <Select
                                        value={seccion_responsable_sel}
                                        onChange={(e)=>setSeccionResponsable(Number(e.target.value))}
                                    >
                                        <option value={SECCION.BODEGA.id}>{SECCION.BODEGA.nombre}</option>
                                        <option value={SECCION.ETIQUETAS.id}>{SECCION.ETIQUETAS.nombre}</option>
                                        <option value={SECCION.LLENADO.id}>{SECCION.LLENADO.nombre}</option>
                                        <option value={SECCION.MARMITAS.id}>{SECCION.MARMITAS.nombre}</option>
                                    </Select>
                                </FormControl>
                            </Flex>
                            <FormControl p={'1em'}>
                                <FormLabel>Observaciones:</FormLabel>
                                <Textarea
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                />
                            </FormControl>
                            <Button m={5} colorScheme={'teal'}
                                    isDisabled={selectedTerminado.productoId==-1}
                                    onClick={ () => CrearOrdenProduccion()}
                            >Crear Orden Produccion</Button>

                            <List spacing={'0.5em'}>
                                {listaTerminados.map((terminado:Terminado) => (
                                    <ListItem key={terminado.productoId} onClick={() => onItemTerminadoClick(terminado)}>
                                        <Box>
                                            <Card fontFamily={'Comfortaa Variable'} p={'0.7em'}
                                                  sx={{
                                                      'bg':terminado.productoId == selectedTerminado.productoId? 'orange.200' : '',
                                                      borderRadius:'0',
                                                      ':hover':{
                                                          bg:terminado.productoId == selectedTerminado.productoId? 'orange.300':'teal.200',
                                                      },
                                                      borderLeft: "0.7em solid",
                                                      borderColor: "teal.200",
                                                  }}
                                            >
                                                <CardHeader p={1} >
                                                    <HStack justifyContent={'space-evenly'} >
                                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {terminado.nombre} </Heading>
                                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {terminado.productoId} </Heading>
                                                    </HStack>
                                                </CardHeader>
                                                <CardBody p={1}>
                                                    <Flex direction={'row'} p={'1em'}>
                                                        <Icon flex={'.5'} boxSize={'3em'} mr={'1em'} as={get_UnitsIcon(terminado.tipoUnidades)}/>
                                                        <VStack flex={'3'} justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                            <Text>Costo Unitario: {terminado.costo}</Text>
                                                            <Text>Unidad de Medida: {terminado.tipoUnidades}</Text>
                                                            <Text>Cantidad x Und: {terminado.cantidadUnidad}</Text>
                                                            <Text>Fecha Creacion: {new Date(terminado.fechaCreacion).toLocaleString()}</Text>
                                                        </VStack>
                                                    </Flex>
                                                </CardBody>
                                            </Card>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Flex>
                    </TabPanel>

                    <TabPanel>
                        <Flex direction={'column'}>
                            <Heading>Ordenes de Produccion Pendientes</Heading>
                            <Flex direction={'row'}>
                                <FormControl>
                                    <Button m={5} colorScheme={'teal'}
                                            onClick={() => UpdateOrdenesActivas()}
                                    >Actualizar</Button>
                                </FormControl>
                            </Flex>
                            <List spacing={'0.5em'}>
                                {listaOrdenesProdActiv.map((orden:OrdenProduccion) => (
                                    <ListItem key={orden.ordenId} >
                                        <Box>
                                            <Card fontFamily={'Comfortaa Variable'} p={'0.7em'}
                                                  sx={{
                                                      borderRadius:'0',
                                                      ':hover':{
                                                          //bg:'teal.200',
                                                      },
                                                      borderLeft: "0.7em solid",
                                                      borderColor: "red.300",
                                                  }}
                                            >
                                                <CardHeader p={1} >
                                                    <HStack justifyContent={'space-evenly'} >
                                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Producto: {orden.terminado.nombre} </Heading>
                                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Orden Id: {orden.terminado.productoId} </Heading>
                                                    </HStack>
                                                </CardHeader>
                                                <CardBody p={1}>
                                                    <Flex direction={'row'} p={'1em'} h={'full'} w={'full'}>
                                                        <VStack flex={'3'} justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                            <Text>Unidad de Medida: {orden.terminado.tipoUnidades}</Text>
                                                            <Text>Cantidad x Und: {orden.terminado.cantidadUnidad}</Text>
                                                            <Text>Fecha Creacion Orden: {new Date(orden.fechaInicio).toLocaleString()}</Text>
                                                            <Accordion allowToggle w={'full'}>
                                                                <AccordionItem>
                                                                    <AccordionButton>
                                                                        <Box as='span' flex='1' textAlign='left'>
                                                                            Ordenes de Seguimiento
                                                                          </Box>
                                                                    </AccordionButton>
                                                                    <AccordionPanel pb={4}>
                                                                        <List spacing={'0.5em'}>
                                                                            {orden.ordenesSeguimiento.map((seg:OrdenSeguimiento) => (
                                                                                <Flex direction={'row'}>
                                                                                    <VStack sx={{
                                                                                                'borderLeft':'0.7em solid',
                                                                                                'borderColor': seg.estado==0? 'red.300':'green.200',
                                                                                            }}>
                                                                                        <ListItem key={seg.seguimientoId} p={'0.2em'}>
                                                                                            <Text> Id Orden Seguimiento: {seg.seguimientoId}</Text>
                                                                                            <Text>{seg.insumo.producto.nombre}</Text>
                                                                                            <Text> Tipo Producto {seg.insumo.producto.tipo_producto}</Text>
                                                                                        </ListItem>
                                                                                    </VStack>
                                                                                </Flex>
                                                                            ))}
                                                                        </List>
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </VStack>
                                                        <Text>Observaciones : {orden.observaciones} </Text>
                                                    </Flex>
                                                </CardBody>
                                            </Card>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Flex>
                    </TabPanel>

                    <TabPanel>
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    )
}
