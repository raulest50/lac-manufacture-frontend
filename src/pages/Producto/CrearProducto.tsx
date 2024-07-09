
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
    Select, Icon,
} from '@chakra-ui/react'

import { IoCubeSharp } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";

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



function CrearProducto(){

    const opts_ptype = {materiaPrima: 'Materia Prima', semiTerminado:'Semi Terminado', Terminado:'Terminado'};
    const units = {KG:'KG', L:'L', U:'U'};

    const strs_bcod = {cod:'Codificar', mod:'Modificar'}
    const bcod_colors = {cod:'teal', mod:'orange'}

    // @ts-ignore
    const [bcod_color, setBcodColor] = useState(bcod_colors.cod)
    // @ts-ignore
    const [bcod_text, setBcodText] = useState(strs_bcod.cod)

    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [unidad, setUnidad] = useState(units.KG);
    const [cant_x_unidad, setCant_x_unidad] = useState(0);

    const [listaProductos, setListaProductos] = useState([])

    type MiItem = {
        id: number;
        nombre: string;
        notas: string;
        costo: number;
        tipo: string;
        fechaCreacion: string;
    };

    const toast = useToast()

    const saveMateriaPrimSubmit = async () => {
        const producto = {
            nombre:descripcion,
            costo:costo,
            notas:observaciones,
            tipo:opts_ptype.materiaPrima,
            unit_type:unidad,
            cant_x_unidad:cant_x_unidad,
        };

        try {
            console.log(serverParams.getProductoEndPoint_save());
            const response = await axios.post(serverParams.getProductoEndPoint_save(), producto);
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

    const getProductosTodos = async () => {
            try {
                const response =
                    await axios.get(serverParams.getProductoEndPoint_getall());
                console.log(serverParams.getProductoEndPoint_getall());
                setListaProductos(response.data.content);
            } catch (error) {
                console.error('Error en getAll', error);
            }
        };


    return(
        
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Codificar Producto'}/>
            <Tabs isFitted gap={'1em'} variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Materia Prima</Tab>
                    <Tab sx={my_style_tab} onClick={getProductosTodos}>Crear Terminado/Semiterminado</Tab>

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
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
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
                                        <Select flex={"1"} defaultValue={units.KG}
                                                value={unidad}
                                                onChange={(e) => setUnidad(e.target.value)}
                                        >
                                            <option value={units.KG}>{units.KG}</option>
                                            <option value={units.L}>{units.L}</option>
                                            <option value={units.U}>{units.U}</option>
                                        </Select>
                                        <FormControl flex={"4"}>
                                            <FormLabel>Cantidad por Unidad</FormLabel>
                                            <Input
                                                value={cant_x_unidad}
                                                onChange={(e) => setCant_x_unidad(Number(e.target.value))}
                                                variant={'filled'}/>
                                        </FormControl>
                                    </Flex>
                                </GridItem>

                            </SimpleGrid>
                        </VStack>
                        <Button m={5} colorScheme={bcod_color} onClick={saveMateriaPrimSubmit}>{bcod_text}</Button>
                    </TabPanel>


                    {/*panel codificar terminado o semiterminado*/}
                    <TabPanel>
                        <HStack p={0} m={0} w={'full'} h={'full'}>

                            {/*panel izquierdo*/}
                            <VStack w={'full'} h={'full'}>
                                <Heading p={2} bg={'green.200'} size={'md'}>Productos Existentes</Heading>
                                <Box w={'full'} h={'full'}>
                                    <List spacing={'0.5em'}>
                                        {listaProductos.map((item:MiItem) => (
                                            <ListItem key={item.id}>
                                                <Box>
                                                    <Card sx={cardItem_style} fontFamily={'Comfortaa Variable'} p={'0.7em'}>
                                                        <CardHeader p={1} >
                                                            <HStack justifyContent={'space-evenly'} >
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> {item.nombre} </Heading>
                                                                <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Id: {item.id} </Heading>
                                                            </HStack>
                                                        </CardHeader>
                                                        <CardBody p={1}>
                                                            <HStack p={'1em'}>
                                                                <Icon boxSize={'3em'} mr={'1em'} as={item.tipo === 'Materia Prima' ? IoCubeSharp : FaCubes}/>
                                                                <VStack justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                                                    <Text>Costo: {item.costo}</Text>
                                                                    <Text>Tipo: {item.tipo}</Text>
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
                                <Button
                                    onClick={getProductosTodos}
                                    colorScheme={'teal'}>Cargar Productos</Button>
                            </VStack>


                            {/*panel derecho*/}
                            <VStack w={'full'} h={'full'}>
                                <FormControl>
                                    <Select defaultValue={opts_ptype.semiTerminado}>
                                        <option value={opts_ptype.semiTerminado}>{opts_ptype.semiTerminado}</option>
                                        <option value={opts_ptype.Terminado}>{opts_ptype.Terminado}</option>
                                    </Select>
                                    <FormLabel>Descripcion</FormLabel>
                                    <Input sx={input_style}></Input>
                                </FormControl>
                            </VStack>


                        </HStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
        
    );
}

export default CrearProducto;