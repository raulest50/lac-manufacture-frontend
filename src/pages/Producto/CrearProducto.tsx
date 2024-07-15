
import {useState} from 'react'
import MyHeader from '../../components/MyHeader.tsx'

import {serverParams} from '../../api/params.tsx'

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

const my_style_tab={
    borderRadius:0,
//    border:0,
    ':active':{
        bg:'blue.200',
    },
    ':selected':{
        bg:'blue.200',
    },
}


const input_style = {
    bg:'gray.200',
    variant:'filled',
    borderRadius:0,
}

const cardItem_style = {
    borderRadius:'0',
    ':hover':{
        bg:'teal.200',
    },
    borderLeft: "0.7em solid",
    borderColor: "blue.200",


}



import {TIPOS_PRODUCTOS, UNIDADES} from "../../models/producto.tsx";

function CrearProducto(){

    type MiItem = {
        producto_id: number;
        nombre: string;
        observaciones: string;
        costo: number;
        tipo_unidades: string;
        fechaCreacion: string;
    };

    //const strs_bcod = {cod:'Codificar', mod:'Modificar'}
    //const bcod_colors = {cod:'teal', mod:'orange'}

    //const [bcod_color, setBcodColor] = useState(bcod_colors.cod)
    //const [bcod_text, setBcodText] = useState(strs_bcod.cod)

    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tipo_unidad, setTipo_unidad] = useState(UNIDADES.KG);
    const [cantidad_unidad, setCantidad_unidad] = useState('');

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
            tipo_unidad:tipo_unidad,
            cantidad_unidad:cantidad_unidad,
            tipo_producto:TIPOS_PRODUCTOS.materiaPrima
        };

        try {
            console.log(serverParams.getProductoEndPoint_save());
            const response = await axios.post(serverParams.getProductoEndPoint_save(), materia_prima);
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

    // hace un getRequest para traer la lista de MateriasPrimas
    const SearchMprimas = async () => {
        try {
            const response =
                await axios.get(serverParams.getMateriaPrimaEndPoint_search(), {params:{search:busqueda, tipoBusqueda:busqueda_param}});
            //console.log(serverParams.getProductoEndPoint_getall());
            setListaMP(response.data.content);
        } catch (error) {
            console.error('Error en getAll', error);
        }
    };

    // hace un getRequest para traer la lista de semiTerminados
    const SearchSemi = async () => {
        try {
            const response =
                await axios.get(serverParams.getSemiTerminadoEndPoint_search(), {params:{search:busqueda, tipoBusqueda:busqueda_param}});
            //console.log(serverParams.getProductoEndPoint_getall());
            setListaSemi(response.data.content);
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

    const onItemClick = (item:MiItem) => {
        setListaSelected((prevSelected) => {
            const isItemSelected = prevSelected.some((selectedItem) => selectedItem.producto_id === item.producto_id);

            if (isItemSelected) {
                // Item is already in the list, remove it
                return prevSelected.filter((selectedItem) => selectedItem.producto_id !== item.producto_id);
            } else {
                // Item is not in the list, add it
                return [...prevSelected, item];
            }
        });
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
                                        <Select flex={"1"} defaultValue={UNIDADES.KG}
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
                                                //inputMode={"decimal"}
                                                //pattern={"[0-9]*[.]?[0-9]*"}
                                                value={cantidad_unidad}
                                                onChange={(e) => {
                                                        setCantidad_unidad(e.target.value)
                                                    }
                                                }
                                                variant={'filled'}/>
                                        </FormControl>
                                    </Flex>
                                </GridItem>

                            </SimpleGrid>
                        </VStack>
                        <Button m={5} colorScheme={'teal'} onClick={saveMateriaPrimSubmit}>{"Codificar"}</Button>
                    </TabPanel>


                    {/*panel codificar terminado o semiterminado*/}
                    <TabPanel>
                        <HStack p={0} m={0} w={'full'} h={'full'}>

                            {/*panel izquierdo*/}
                            <VStack w={'full'} >
                                <HStack w={'full'} h={'full'}>
                                    <Heading p={2} bg={'green.200'} size={'md'}>Bandeja de Seleccion</Heading>
                                    <Button
                                        onClick={get_Semi_and_MP}
                                        colorScheme={'teal'}>Cargar Productos</Button>
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
                                    <Select defaultValue={TIPO_BUSQUEDA.NOMBRE}
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
                                            <ListItem key={item.producto_id} onClick={() => onItemClick(item)}>
                                                <Box>
                                                    <Card sx={cardItem_style} fontFamily={'Comfortaa Variable'} p={'0.7em'}>
                                                        <CardHeader p={1} >
                                                            <HStack justifyContent={'space-evenly'} >
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {item.nombre} </Heading>
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {item.producto_id} </Heading>
                                                            </HStack>
                                                        </CardHeader>
                                                        <CardBody p={1}>
                                                            <HStack p={'1em'}>
                                                                <Icon boxSize={'3em'} mr={'1em'} as={get_UnitsIcon(item.tipo_unidades)}/>
                                                                <VStack justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                                    <Text>Costo: {item.costo}</Text>
                                                                    <Text>Tipo: {item.tipo_unidades}</Text>
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
                            <VStack w={'full'} h={'full'} alignItems="flex-start">
                                <FormControl>
                                    <Select defaultValue={TIPOS_PRODUCTOS.semiTerminado}>
                                        <option value={1}>{TIPOS_PRODUCTOS.semiTerminado}</option>
                                        <option value={2}>{TIPOS_PRODUCTOS.Terminado}</option>
                                    </Select>
                                    <FormLabel>Descripcion</FormLabel>
                                    <Input sx={input_style}></Input>
                                </FormControl>

                                <Box w={'full'} h={'full'}>
                                    <List spacing={'0.5em'}>
                                        {listaSelected.map((item:MiItem) => (
                                            <ListItem key={item.producto_id}>
                                                <Box>
                                                    <Card sx={cardItem_style} fontFamily={'Comfortaa Variable'} p={'0.7em'}>
                                                        <CardHeader p={1} >
                                                            <HStack justifyContent={'space-evenly'} >
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {item.nombre} </Heading>
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {item.producto_id} </Heading>
                                                            </HStack>
                                                        </CardHeader>
                                                        <CardBody p={1}>
                                                            <HStack p={'1em'}>
                                                                <Icon boxSize={'3em'} mr={'1em'} as={get_UnitsIcon(item.tipo_unidades)}/>
                                                                <VStack justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                                    <Text>Costo: {item.costo}</Text>
                                                                    <Text>Tipo: {item.tipo_unidades}</Text>
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
                        </HStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
        
    );
}

export default CrearProducto;