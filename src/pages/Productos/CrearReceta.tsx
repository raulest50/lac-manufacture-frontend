import React, { useState } from 'react';
import {
    VStack, HStack, Heading, Button, FormControl, FormLabel, Input,
    IconButton, Select, Box, List, ListItem, Card, CardHeader, CardBody, Text,
    Icon, Flex, Textarea, useToast
} from '@chakra-ui/react';

import { IoCubeSharp } from 'react-icons/io5';
import { FaCubes } from 'react-icons/fa';
import { MdWaterDrop } from 'react-icons/md';
import { FaHashtag } from 'react-icons/fa6';
import { GiWeight } from 'react-icons/gi';

import axios from 'axios';

import { TIPOS_PRODUCTOS, UNIDADES } from '../../api/constants.tsx';
import { input_style, cardItem_style_sel_tray, cardItem_style_rcta } from '../../styles/styles_general.tsx';
import { CrearProductoHelper, MiItem, Insumo } from './CrearProductoHelper.tsx';
import EndPointsURL from '../../api/EndPointsURL.tsx';

function CrearReceta() {
    // Define all the states and functions specific to this component here.
    const [nombre_st, setNombre_st] = useState('');
    const [costo_st, setCosto_st] = useState(0);
    const [observaciones_st, setObservaciones_st] = useState('');
    const [tipo_unidad_st, setTipo_unidad_st] = useState(UNIDADES.KG);
    const [cantidad_unidad_st, setCantidad_unidad_st] = useState('');
    const [tipo_producto_st, setTipoProducto_st] = useState(TIPOS_PRODUCTOS.semiTerminado);

    const TIPO_BUSQUEDA = { NOMBRE: 'NOMBRE', ID: 'ID' };

    const [busqueda, setBusqueda] = useState('');
    const [busqueda_tipo_mp, setBusqueda_tipo_mp] = useState(true);
    const [busqueda_param, setBusqueda_param] = useState(TIPO_BUSQUEDA.NOMBRE);

    const [listaMP, setListaMP] = useState([]);
    const [listaSemi, setListaSemi] = useState([]);

    const [listaSelected, setListaSelected] = useState<MiItem[]>([]);

    const toast = useToast();

    const endPoints = new EndPointsURL();

    // Define all the functions used within this component
    const get_UnitsIcon = (tipo_unidades: string) => {
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

    const saveSemi_or_Termi_Submit = async () => {
        const insumos: Insumo[] = listaSelected.map((item) => ({
            cantidadRequerida: item.cantidadRequerida,
            producto: {
                productoId: item.productoId,
                tipo_producto: item.tipo_producto,
                nombre: item.nombre,
                observaciones: item.observaciones,
                costo: item.costo,
                tipoUnidades: item.tipoUnidades,
                cantidadUnidad: item.cantidadUnidad,
                fechaCreacion: item.fechaCreacion,
            },
        }));

        const semiTermi = {
            nombre: nombre_st,
            observaciones: observaciones_st,
            costo: costo_st,
            tipoUnidades: tipo_unidad_st,
            cantidadUnidad: cantidad_unidad_st,
            tipo_producto: tipo_producto_st,
            insumos,
            status: tipo_producto_st === TIPOS_PRODUCTOS.semiTerminado ? null : 0,
        };

        await CrearProductoHelper.CodificarSemiTermi(semiTermi, toast);
    };

    const SearchMprimas = async () => {
        try {
            const response = await axios.get(endPoints.search_mprima, {
                params: { search: busqueda, tipoBusqueda: busqueda_param },
            });
            const updatedListaMP = response.data.content.map((item: MiItem) => ({
                ...item,
                tipo_producto: 'M',
            }));
            setListaMP(updatedListaMP);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    const SearchSemi = async () => {
        try {
            const response = await axios.get(endPoints.search_semi, {
                params: { search: busqueda, tipoBusqueda: busqueda_param },
            });
            const updatedListaSemi = response.data.content.map((item: MiItem) => ({
                ...item,
                tipo_producto: 'S',
            }));
            setListaSemi(updatedListaSemi);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    const get_Semi_and_MP = async () => {
        try {
            await SearchMprimas();
            await SearchSemi();
        } catch (error) {
            console.error('Error in get_Semi_and_MP', error);
        }
    };

    const getListaProductos = () => {
        return busqueda_tipo_mp ? listaMP : listaSemi;
    };

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            get_Semi_and_MP();
        }
    };

    const onItemClick = (item: MiItem) => {
        setListaSelected((prevSelected) => {
            const isItemSelected = prevSelected.some(
                (selectedItem) => selectedItem.productoId === item.productoId
            );

            if (isItemSelected) {
                setCosto_st(costo_st - item.costo * Number(item.cantidadRequerida));
                return prevSelected.filter(
                    (selectedItem) => selectedItem.productoId !== item.productoId
                );
            } else {
                item.cantidadRequerida = '1';
                setCosto_st(costo_st + item.costo * Number(item.cantidadRequerida));
                return [...prevSelected, item];
            }
        });
    };

    const handleCantidadChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const listaS = [...listaSelected];
        listaS[index].cantidadRequerida = e.target.value;
        setListaSelected(listaS);
        setCosto_st(
            listaSelected.reduce(
                (sum, item) => sum + item.costo * Number(item.cantidadRequerida),
                0
            )
        );
    };

    return (
        <Flex direction="row" p={0} m={0} w="full" h="full">
            {/* Left Panel */}
            <VStack w={'full'} h={'full'} p={'1em'}>
                <HStack w={'full'} h={'full'}>
                    <Heading w={'full'} p={2} bg={'blue.200'} size={'md'}>Bandeja de Seleccion</Heading>
                    <Button
                        display={'none'}
                        onClick={get_Semi_and_MP}
                        colorScheme={'teal'}>Cargar Productos
                    </Button>
                </HStack>
                <HStack w={'full'} alignItems={"center"}>
                    <FormControl>
                        <FormLabel>Buscar</FormLabel>
                        <Input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => onKeyPress_InputBuscar(e)}
                            sx={input_style}/>
                    </FormControl>
                    <IconButton
                        aria-label='Search database'
                        icon={busqueda_tipo_mp ? <IoCubeSharp/> : <FaCubes/>}
                        onClick={ () =>{
                            setBusqueda_tipo_mp(!busqueda_tipo_mp);
                        }}
                        fontSize={{ base: "1.2em", md: "2em", lg: "2.8m", xl:"3.5em" }}  // Responsive font size
                        size={"lg"}
                    />
                    <Select
                        value={busqueda_param}
                        onChange={(e) => setBusqueda_param(e.target.value)}
                    >
                        <option value={TIPO_BUSQUEDA.NOMBRE}>{TIPO_BUSQUEDA.NOMBRE}</option>
                        <option value={TIPO_BUSQUEDA.ID}>{TIPO_BUSQUEDA.ID}</option>
                    </Select>
                </HStack>
                <Box w={'full'} >
                    <List spacing={'0.5em'}>
                        {getListaProductos().map((item:MiItem) => (
                            <ListItem key={item.productoId} onClick={() => onItemClick(item)}>
                                <Box>
                                    <Card sx={cardItem_style_sel_tray} fontFamily={'Comfortaa Variable'} p={'0.7em'}>
                                        <CardHeader p={1} >
                                            <HStack justifyContent={'space-evenly'} >
                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {item.nombre} </Heading>
                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {item.productoId} </Heading>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody p={1}>
                                            <HStack p={'1em'}>
                                                <Icon boxSize={'3em'} mr={'1em'} as={get_UnitsIcon(item.tipoUnidades)}/>
                                                <VStack justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                    <Text>Costo Unitario: {item.costo}</Text>
                                                    <Text>Unidad de Medida: {item.tipoUnidades}</Text>
                                                    <Text>Cantidad x Und: {item.cantidadUnidad}</Text>
                                                    <Text>Fecha Creacion: {new Date(item.fechaCreacion).toLocaleString()}</Text>
                                                </VStack>
                                            </HStack>
                                        </CardBody>
                                    </Card>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </VStack>
            {/* Right Panel */}
            <VStack w={'full'} h={'full'} p={'1em'}>
                <Heading w={'full'} p={2} bg={'green.200'} size={'md'}>Receta</Heading>
                <FormControl>
                    <Flex direction={'row'}>
                        <FormLabel>Tipo Producto</FormLabel>
                        <Select flex={'3'}
                                value={tipo_producto_st}
                                onChange={(e) => setTipoProducto_st(e.target.value)}
                        >
                            <option value={TIPOS_PRODUCTOS.semiTerminado}>{'Semi Terminado'}</option>
                            <option value={TIPOS_PRODUCTOS.Terminado}>{'Terminado'}</option>
                        </Select>
                    </Flex>

                    <FormLabel>Nombre</FormLabel>
                    <Input
                        value={nombre_st}
                        onChange={(e) => setNombre_st(e.target.value)}
                        sx={input_style}/>
                </FormControl>
                <Text>Costo Ingredientes: { costo_st } </Text>
                <FormControl>
                    <Flex>
                        <FormLabel>Unidades</FormLabel>
                        <Select flex={'1'}
                                value={tipo_unidad_st}
                                onChange={(e) => setTipo_unidad_st(e.target.value)}
                        >
                            <option value={UNIDADES.KG}>{UNIDADES.KG}</option>
                            <option value={UNIDADES.L}>{UNIDADES.L}</option>
                            <option value={UNIDADES.U}>{UNIDADES.U}</option>
                        </Select>
                        <FormLabel flex={'0.5'}>Cantidad por unidad</FormLabel>
                        <Input flex={'1'}
                               value={cantidad_unidad_st}
                               onChange={(e) => setCantidad_unidad_st(e.target.value)}
                               sx={input_style}/>
                    </Flex>
                </FormControl>
                <FormControl>
                    <FormLabel>Observaciones</FormLabel>
                    <Textarea
                        value={observaciones_st}
                        onChange={(e) => setObservaciones_st(e.target.value)}
                        variant={'filled'}/>
                </FormControl>
                <Box w={'full'} h={'full'}>
                    <List spacing={'0.5em'}>
                        {listaSelected.map((item:MiItem, index) => (
                            <ListItem key={index}>
                                <Box>
                                    <Card sx={cardItem_style_rcta} fontFamily={'Comfortaa Variable'} p={'0.7em'}>
                                        <CardHeader p={1} >
                                            <HStack justifyContent={'space-evenly'} >
                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {item.nombre} </Heading>
                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {item.productoId} </Heading>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody p={1}>
                                            <Flex direction={'row'} p={'1em'}>
                                                <Icon flex={'.5'} boxSize={'3em'} mr={'1em'} as={get_UnitsIcon(item.tipoUnidades)}/>
                                                <VStack flex={'3'} justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                    <Text>Costo Unitario: {item.costo}</Text>
                                                    <Text>Unidad de Medida: {item.tipoUnidades}</Text>
                                                    <Text>Cantidad x Und: {item.cantidadUnidad}</Text>
                                                    <Text>Fecha Creacion: {new Date(item.fechaCreacion).toLocaleString()}</Text>
                                                </VStack>
                                                <FormControl flex={'1'}>
                                                    <FormLabel>Cantidad Requerida</FormLabel>
                                                    <Input
                                                        value={item.cantidadRequerida}
                                                        onChange={(e) => handleCantidadChange(e, index)}
                                                        sx={input_style}/>
                                                </FormControl>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <HStack>
                    <FormControl>
                        <Button m={5} colorScheme={'teal'}
                                onClick={() =>{
                                    if( !(listaSelected.length == 0) ){
                                        saveSemi_or_Termi_Submit();
                                    }
                                }}
                        >{"Codificar Producto"}</Button>
                    </FormControl>
                    <FormControl>
                        <Button m={5} colorScheme={'orange'}
                                onClick={() =>{
                                    setListaSelected([]);
                                    setCosto_st(0);
                                }}
                        >{"Limpiar Lista"}</Button>
                    </FormControl>
                </HStack>
            </VStack>
        </Flex>
    );
}

export default CrearReceta;
