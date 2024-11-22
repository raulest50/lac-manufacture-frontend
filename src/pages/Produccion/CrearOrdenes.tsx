import {
    Box,
    Button,
    Card, CardBody, CardHeader,
    Flex,
    FormControl,
    FormLabel, Heading, HStack, Icon,
    Input,
    List,
    ListItem,
    Select, TabPanel, Text,
    Textarea, useToast, VStack
} from "@chakra-ui/react";
import {Terminado} from "../../models/Terminado.tsx";
import {OrdenProduccionDTA} from "../../models/OrdenProduccionDTA.tsx";
import {SpringRequestHandler} from "../../api/SpringRequestHandler.tsx";
import {MdWaterDrop} from "react-icons/md";
import {GiWeight} from "react-icons/gi";
import {FaHashtag} from "react-icons/fa6";
import {useState} from "react";
import {OrdenProduccion} from "../../models/OrdenProduccion.tsx";

import {Terminado} from "../../models/Terminado.tsx";
import {SpringRequestHandler} from "../../api/SpringRequestHandler.tsx";
import {OrdenProduccionDTA} from "../../models/OrdenProduccionDTA.tsx";

const TIPO_BUSQUEDAS = {ID:'ID', NOMBRE:'NOMBRE'};


export default function CrearOrdenes(){

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
    const toast = useToast();

    const [tipo_search_sel, setTipoSearchSel] = useState(TIPO_BUSQUEDAS.NOMBRE);
    const [busqueda, setBusqueda] = useState('');
    //const [seccion_responsable_sel, setSeccionResponsable] = useState(SECCION.BODEGA_PISO_1.id);
    const [observaciones, setObservaciones] = useState('');

    const [listaTerminados, setListaTerminados] = useState<Terminado[]>([]);

    const [listaOrdenesProdActiv, setListaOrdenesProdActive] = useState<OrdenProduccion[]>([]);


    const CrearOrdenProduccion = async () => {
        const ordenProduccionDTA:OrdenProduccionDTA = {
            terminadoId: selectedTerminado.productoId,
            //seccionResponsable: seccion_responsable_sel, // ya esta establecida a la hora de codificar terminado o smeiterminado
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


    );

}