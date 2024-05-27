
import {useState} from 'react'
import MyHeader from '../../components/MyHeader.tsx'

import {serverParams} from '../../api/params.tsx'

import axios from 'axios'

import {
    Container, SimpleGrid, GridItem, HStack, Box, VStack, Stack,
    Tab, TabList, Tabs, TabPanels, TabPanel,
    Button, useToast,
    FormControl, FormLabel, Input,
    Textarea, Heading, Text,
    List, ListItem,
    Card, CardBody, CardHeader
} from '@chakra-ui/react'

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
    borderRadius:0,
    ':hover':{
        bg:'teal.200',
    },

}



function CrearProducto(){

    const strs_bcod = {cod:'Codificar', mod:'Modificar'}
    const bcod_colors = {cod:'teal', mod:'orange'}

    // @ts-ignore
    const [bcod_color, setBcodColor] = useState(bcod_colors.cod)
    // @ts-ignore
    const [bcod_text, setBcodText] = useState(strs_bcod.cod)

    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');

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
            tipo:'Materia Prima',
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
        
        <Container minW={'container.lg'} w={'full'} h={'full'}>
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
                                <Box w={'full'} h={'full'} bg={'green.200'}>
                                    <List spacing={0}>
                                        {listaProductos.map((item:MiItem) => (
                                            <ListItem key={item.id}>
                                                <Box>
                                                    <Card sx={cardItem_style}>
                                                        <CardHeader p={1}>
                                                            <Heading size={'sm'}> Nombre: {item.nombre} - Id: {item.id} </Heading>
                                                        </CardHeader>
                                                        <CardBody p={1}>
                                                            <Stack>
                                                                <HStack justifyContent={'space-evenly'}>
                                                                    <Text>Costo: {item.costo}</Text>
                                                                    <Text>Tipo: {item.tipo}</Text>
                                                                </HStack>
                                                                <Text>Fecha Creacion: {new Date(item.fechaCreacion).toLocaleString()}</Text>
                                                            </Stack>
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