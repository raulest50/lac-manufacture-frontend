
import {useState} from 'react'
import MyHeader from '../../components/MyHeader.tsx'

import {ServerParams} from '../../api/params.tsx'

import axios from 'axios'

import {
    Container, SimpleGrid, GridItem, HStack, Box, VStack, Flex,
    Tab, TabList, Tabs, TabPanels, TabPanel,
    Button, useToast,
    FormControl, FormLabel, Input,
    Textarea, Heading, Text,
    List, ListItem,
    Card, CardBody, CardHeader,
    Select, Icon, IconButton,
} from '@chakra-ui/react'

import { IoCubeSharp } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";

import { MdWaterDrop } from "react-icons/md"; // L
import { FaHashtag } from "react-icons/fa6"; // U
import { GiWeight } from "react-icons/gi";  // KG

// Supports weights 100-900
import '@fontsource-variable/league-spartan';
import '@fontsource/anton';

import {my_style_tab} from "../../styles/styles_general.tsx";


const input_style = {
    bg:'gray.200',
    variant:'filled',
    borderRadius:0,
}

const cardItem_style_sel_tray = {
    borderRadius:'0',
    ':hover':{
        bg:'teal.200',
    },
    borderLeft: "0.7em solid",
    borderColor: "blue.200",
}

const cardItem_style_rcta = {
    borderRadius:'0',
    ':hover':{
        bg:'teal.200',
    },
    borderLeft: "0.7em solid",
    borderColor: "green.200",
}



import {TIPOS_PRODUCTOS, UNIDADES, SECCION} from "../../models/constants.tsx";

function CrearProducto(){

    type MiItem = {
        productoId: number;
        tipo_producto:string;
        nombre: string;
        observaciones: string;
        costo: number;
        tipoUnidades: string;
        cantidadUnidad: string;
        fechaCreacion: string;
        cantidadRequerida:string;
    };

    type Insumo = {
        cantidadRequerida: string;
        producto: {
            productoId: number;
            tipo_producto: string;
            nombre: string;
            observaciones: string;
            costo: number;
            tipoUnidades: string;
            cantidadUnidad:string;
            fechaCreacion: string;
        };
    };

    //const strs_bcod = {cod:'Codificar', mod:'Modificar'}
    //const bcod_colors = {cod:'teal', mod:'orange'}

    //const [bcod_color, setBcodColor] = useState(bcod_colors.cod)
    //const [bcod_text, setBcodText] = useState(strs_bcod.cod)

    // states para codificar materia prima
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tipo_unidad, setTipo_unidad] = useState(UNIDADES.KG);
    const [cantidad_unidad, setCantidad_unidad] = useState('');

    // states para codificar semiterminado o terminado
    const [nombre_st, setNombre_st] = useState('');
    const [costo_st, setCosto_st] = useState('');
    const [observaciones_st, setObservaciones_st] = useState('');
    const [tipo_unidad_st, setTipo_unidad_st] = useState(UNIDADES.KG);
    const [cantidad_unidad_st, setCantidad_unidad_st] = useState('');
    const [seccion_responsable_st, setSeccionResponsable_st] = useState(SECCION.BODEGA.id);
    const [tipo_producto_st, setTipoProducto_st] = useState(TIPOS_PRODUCTOS.semiTerminado)

    const TIPO_BUSQUEDA = {NOMBRE:"NOMBRE", ID:"ID"}

    const [busqueda, setBusqueda] = useState('');

    // true: se muestra la lista de materias primas | false: se muestra la lista de semiterminados
    const [busqueda_tipo_mp, setBusqueda_tipo_mp] = useState(true)

    // para definir si se busca por ID o por NOMBRE
    const [busqueda_param, setBusqueda_param] = useState(TIPO_BUSQUEDA.NOMBRE)

    //const [tipo_producto, setTipo_producto] = useState(TIPOS_PRODUCTOS.semiTerminado)
    //const [listaProductos, setListaProductos] = useState([])

    const [listaMP, setListaMP] = useState([])
    const [listaSemi, setListaSemi] = useState([])

    const [listaSelected, setListaSelected] = useState<MiItem[]>([])


    const toast = useToast()

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

    const saveMateriaPrimSubmit = async () => {
        const materia_prima = {
            nombre:nombre,
            observaciones:observaciones,
            costo:costo,
            tipoUnidades:tipo_unidad,
            cantidadUnidad:cantidad_unidad,
            tipo_producto:TIPOS_PRODUCTOS.materiaPrima
        };

        try {
            console.log(ServerParams.getProductoEndPoint_save());
            const response = await axios.post(ServerParams.getProductoEndPoint_save(), materia_prima);
            console.log('Product saved successfully:', response.data);

            toast({
            title: 'Materia Prima Creada',
            description: `"Creacion exitosa  id:${response.data}, time:${response.data.fechaCreacion}"`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            })
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
            title: 'Ha ocurrido un error',
            description: `" ha ocurrido un error"`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
        }
    };

    const saveSemi_or_Termi_Submit = async () => {

        const insumos: Insumo[] = listaSelected.map(item => ({
            cantidadRequerida: item.cantidadRequerida,
            producto: {
                productoId: item.productoId,
                tipo_producto: item.tipo_producto,
                nombre: item.nombre,
                observaciones: item.observaciones,
                costo: item.costo,
                tipoUnidades: item.tipoUnidades,
                cantidadUnidad: item.cantidadUnidad,
                fechaCreacion: item.fechaCreacion
            }
        }));

        const semi_or_termi = {
            nombre:nombre_st,
            observaciones:observaciones_st,
            costo:costo_st,
            tipoUnidades:tipo_unidad_st,
            cantidadUnidad:cantidad_unidad_st,
            tipo_producto:tipo_producto_st,
            seccionResponsable:seccion_responsable_st,
            insumos:insumos,
            status:tipo_producto_st == TIPOS_PRODUCTOS.semiTerminado ? null : 0
        };

        try {
            console.log(ServerParams.getProductoEndPoint_save());
            const response = await axios.post(ServerParams.getProductoEndPoint_save(), semi_or_termi);
            console.log('Product saved successfully:', response.data);

            toast({
            title: 'Materia Prima Creada',
            description: `"Creacion exitosa  id:${response.data}, time:${response.data.fechaCreacion}"`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            })
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
            title: 'Ha ocurrido un error',
            description: `" ha ocurrido un error"`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
            console.log('json object',semi_or_termi)
        }
    };

    // hace un getRequest para traer la lista de MateriasPrimas
    const SearchMprimas = async () => {
        try {
            const response =
                await axios.get(ServerParams.getMateriaPrimaEndPoint_search(), {params:{search:busqueda, tipoBusqueda:busqueda_param}});
            //console.log(serverParams.getProductoEndPoint_getall());
            const updatedListaMP = response.data.content.map((item: MiItem) => ({
                ...item,
                tipo_producto: 'M'
            }));
            setListaMP(updatedListaMP);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    // hace un getRequest para traer la lista de semiTerminados
    const SearchSemi = async () => {
        try {
            const response =
                await axios.get(ServerParams.getSemiTerminadoEndPoint_search(), {params:{search:busqueda, tipoBusqueda:busqueda_param}});
            //console.log(serverParams.getProductoEndPoint_getall());
            const updatedListaSemi = response.data.content.map((item: MiItem) => ({
                ...item,
                tipo_producto: 'S'
            }));
            setListaSemi(updatedListaSemi);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    // carga las 2 listas, las de materias primas y la de semiterminado
    const get_Semi_and_MP = async () => {
        try {
            // Await the search functions
            await SearchMprimas();
            await SearchSemi();
            // Any additional logic after both searches are completed
            //console.log('Both searches completed');
        } catch (error) {
            console.error('Error in get_Semi_and_MP', error);
        }
    };

    // deacuerdo al toggle button se selecciona que lisat va en la bandeja, mprimas o semiterminado.
    const getListaProductos = () => {
        if(busqueda_tipo_mp) return listaMP;
        else return listaSemi;
    };

    const onKeyPress_InputBuscar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          //console.log('Enter key pressed', inputValue);
          get_Semi_and_MP();
        }
    };

    // pasa un item desde ka bandeja de seleecion(izquierda) a la bandeja de receta (badeja derecha)
    const onItemClick = (item:MiItem) => {
        setListaSelected((prevSelected) => {
            const isItemSelected = prevSelected.some((selectedItem) => selectedItem.productoId === item.productoId);

            if (isItemSelected) {
                // Item is already in the list, remove it
                return prevSelected.filter((selectedItem) => selectedItem.productoId !== item.productoId);
            } else {
                // Item is not in the list, add it
                return [...prevSelected, item];
            }
        });
    };

    // para manejar correctamente el estdo de cantidad_requeridad de cada item.
    const handleCantidadChange = (producto_id: number, newCantidad: string) => {
        setListaSelected((prevSelected) =>
            prevSelected.map((item) =>
                item.productoId === producto_id ? { ...item, cantidad_requerida: newCantidad } : item
            )
        );
    };


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Codificar Producto'}/>
            <Tabs isFitted gap={'1em'} variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Materia Prima</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                </TabList>
                
                <TabPanels>

                    {/*panel codificar materia prima*/}
                    <TabPanel >
                        <VStack w={'full'} h={'full'} spacing={4}>
                            {/*descripcion input*/}
                            <SimpleGrid w={'full'} h={'full'} columns={3} gap={'2em'}>
                                <GridItem colSpan={2}>
                                    <FormControl>
                                        <FormLabel>Descripcion</FormLabel>
                                        <Input
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            sx={input_style}/>
                                    </FormControl>
                                </GridItem>

                                {/*costo input*/}
                                <GridItem colSpan={1}>
                                    <FormControl>
                                        <FormLabel>Costo</FormLabel>
                                        <Input
                                            value={costo}
                                            onChange={(e) => setCosto(e.target.value)}
                                            sx={input_style}/>
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={2}>
                                    <FormControl>
                                        <FormLabel>Observaciones</FormLabel>
                                        <Textarea
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            variant={'filled'}/>
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={1}>
                                    <Flex w={'full'} direction={'row'} align={'flex-end'} justify={'space-around'} gap={4}>
                                        <Select flex={"1"}
                                                value={tipo_unidad}
                                                onChange={(e) => setTipo_unidad(e.target.value)}
                                        >
                                            <option value={UNIDADES.KG}>{UNIDADES.KG}</option>
                                            <option value={UNIDADES.L}>{UNIDADES.L}</option>
                                            <option value={UNIDADES.U}>{UNIDADES.U}</option>
                                        </Select>
                                        <FormControl flex={"4"}>
                                            <FormLabel>Cantidad por Unidad</FormLabel>
                                            <Input
                                                value={cantidad_unidad}
                                                onChange={(e) => setCantidad_unidad(e.target.value)}
                                                variant={'filled'}/>
                                        </FormControl>
                                    </Flex>
                                </GridItem>

                            </SimpleGrid>
                        </VStack>
                        <Button m={5} colorScheme={'teal'} onClick={saveMateriaPrimSubmit}>{"Codificar Materia Prima"}</Button>
                    </TabPanel>


                    {/*panel codificar terminado o semiterminado*/}
                    <TabPanel>
                        <Flex direction={'row'} p={0} m={0} w={'full'} h={'full'}>

                            {/*panel izquierdo*/}
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


                            {/*panel derecho*/}
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
                                    <FormLabel>Seccion Responsable</FormLabel>
                                    <Select flex={'1'}
                                            value={seccion_responsable_st}
                                            onChange={(e) => setSeccionResponsable_st(Number(e.target.value))}
                                    >
                                        <option value={SECCION.BODEGA.id}>{SECCION.BODEGA.nombre}</option>
                                        <option value={SECCION.ETIQUETAS.id}>{SECCION.ETIQUETAS.nombre}</option>
                                        <option value={SECCION.LLENADO.id}>{SECCION.LLENADO.nombre}</option>
                                        <option value={SECCION.MARMITAS.id}>{SECCION.MARMITAS.nombre}</option>
                                    </Select>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input
                                        value={nombre_st}
                                        onChange={(e) => setNombre_st(e.target.value)}
                                        sx={input_style}/>
                                </FormControl>
                                <FormControl>
                                    <Flex>
                                        <FormLabel>Costo</FormLabel>
                                        <Input
                                            flex={'2'}
                                            value={costo_st}
                                            onChange={(e) => setCosto_st(e.target.value)}
                                            sx={input_style}/>
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
                                        {listaSelected.map((item:MiItem) => (
                                            <ListItem key={item.productoId}>
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
                                                                        onChange={(e) => handleCantidadChange(item.productoId, e.target.value)}
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
                                <FormControl>
                                    <Button m={5} colorScheme={'teal'}
                                            onClick={() =>{
                                                if( !(listaSelected.length == 0) ){
                                                    saveSemi_or_Termi_Submit();
                                                }
                                            }}
                                    >{"Codificar Producto"}</Button>
                                </FormControl>
                            </VStack>
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
        
    );
}

export default CrearProducto;