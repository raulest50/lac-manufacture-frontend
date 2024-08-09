
import {useState} from 'react';
import { useToast } from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex, Box,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input, Textarea,
    Button, Heading, Icon,
    Select,
    Text,
} from "@chakra-ui/react";


import { IoCubeSharp } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";

import { MdWaterDrop } from "react-icons/md"; // L
import { FaHashtag } from "react-icons/fa6"; // U
import { GiWeight } from "react-icons/gi";  // KG


import MyHeader from "../components/MyHeader.tsx";
import ProductoSimplePicker from "../components/ProductoSimplePicker.tsx"
import {NavLink} from "react-router-dom";


import '@fontsource-variable/league-spartan';
import '@fontsource/anton';
import {my_style_tab} from "../styles/styles_general.tsx";


import {CAUSAS_MOVIMIENTOS} from "../models/constants.tsx";
import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {Movimiento} from "../models/Movimiento.tsx";
import {Stock} from "../models/Stock.tsx";
import {Producto} from "../models/Producto.tsx";

const box_icon_sty = {
    margin:'1em',
}


function StockPage(){

    const [producto_id, setProductoId] = useState('');
    const [causa_movimiento, setCausaMovimiento] = useState(CAUSAS_MOVIMIENTOS.COMPRA);
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');


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
    

    const emptyStock: Stock = {
        cantidad_totalizada: 0,
        producto: {
            productoId: 0,
            nombre: '',
            observaciones: '',
            costo: 0,
            fechaCreacion: '',
            tipoUnidades: '',
            cantidadUnidad: 0,
            tipo_producto: ''
        }
    };

    const [stockItem, setStockItem] = useState<Stock>(emptyStock);
    const [pid2totalize, setPid2Totalize] = useState('');

    const toast = useToast();

    const registrarMovimiento = async () => {
        const movimiento: Movimiento = {
            cantidad: cantidad,
            producto: {
                productoId:producto_id,
                tipo_producto:"M"
            },
            causa: causa_movimiento,
            observaciones: observaciones,
        };
        await SpringRequestHandler.registrarMovimiento(toast, movimiento);
    }

    const onClickItemProductoPicker = (p:Producto) => {
        setPid2Totalize(String(p.productoId!));
        SpringRequestHandler.getStockByProductoId(Number(pid2totalize), setStockItem)
    };

    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'} >
            <MyHeader title={'Movimientos y Stock'} />
            <NavLink to={'/'}>
            </NavLink>


            <Tabs>
                <TabList>
                    <Tab sx={my_style_tab}>Registrar Movimiento</Tab>
                    <Tab sx={my_style_tab}>Stock</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack h={'full'} w={'full'} >
                            <Flex h={'full'} w={'full'}>
                                <FormControl flex={1} p={'.5em'}>
                                    <FormLabel>id Producto</FormLabel>
                                    <Input
                                        value={producto_id}
                                        onChange={(e) => setProductoId(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl flex={2} p={'.5em'} >
                                    <FormLabel>Cantidad</FormLabel>
                                    <Input
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value) }
                                    />
                                </FormControl>
                                <FormControl flex={3} p={'.5em'}>
                                    <FormLabel>Tipo de Movimiento</FormLabel>
                                    <Select flex={'1'}
                                            value={causa_movimiento}
                                            onChange={(e) => setCausaMovimiento(e.target.value)}
                                    >
                                        {Object.entries(CAUSAS_MOVIMIENTOS).map( ([key, value]) => (
                                                <option key={key} value={value}>{value}</option>
                                            ) )}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex h={'full'} w={'full'} direction={'row'}>
                                <FormControl flex={4} p={'.5em'} >
                                    <FormLabel>Observaciones</FormLabel>
                                    <Textarea
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        variant={'filled'}/>
                                </FormControl>
                            </Flex>
                            <HStack>
                                <Button colorScheme={'teal'}
                                        onClick={() => registrarMovimiento()}
                                >Registrar Movimiento</Button>
                            </HStack>
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                        <VStack w={'full'} h={'full'}>
                            <Flex direction={'row'} justifyContent="flex-start" w={'full'}>
                                <FormControl flex={1}>
                                    <FormLabel>Producto Id</FormLabel>
                                    <Input
                                        value={pid2totalize}
                                        onChange={(e) => setPid2Totalize(e.target.value)}
                                        />
                                </FormControl>
                                <Button m={5} p={2} colorScheme={'teal'} flex={1}
                                        onClick={() => SpringRequestHandler.getStockByProductoId(Number(pid2totalize), setStockItem)}
                                    >
                                    Calcular Stock</Button>
                                <HStack flex={5}>
                                    <ProductoSimplePicker onClickProducto={onClickItemProductoPicker}/>
                                </HStack>
                            </Flex>
                        </VStack>
                        
                        <Flex direction={'column'} p={'2em'}>
                            <Flex direction={'row'} sx={{borderBottom:'0.2em solid', }}>
                                <Box p={'1em'} sx={box_icon_sty}>
                                    <Icon boxSize={'3em'} mr={'1em'} as={ stockItem.producto.tipo_producto == "M"? IoCubeSharp : FaCubes}/>
                                </Box>
                                <Box  p={'1em'} sx={box_icon_sty}>
                                    <Heading size={'lg'} fontFamily={'Anton'} as={'h2'}>{stockItem.producto.nombre}</Heading>
                                </Box>
                            </Flex>
                            <Flex p={'1em'} pl={'2em'} pr={'2em'} direction={'row'}>
                                <HStack p={'1em'}>
                                    <Text fontFamily={'Anton'} fontSize={'2em'}>Id: </Text>
                                    <Text fontFamily={'Anton'} fontSize={'2em'} >{stockItem.producto.productoId}</Text>
                                    <Text ml={'2em'} fontFamily={'Anton'} fontSize={'2em'} color={stockItem.cantidad_totalizada >= 0 ? 'green.400' : 'red.400'}> Stock: </Text>
                                    <Text fontFamily={'Anton'} fontSize={'2em'} color={stockItem.cantidad_totalizada >= 0 ? 'green.400' : 'red.400'} >{stockItem.cantidad_totalizada}</Text>
                                    <Text ml={'2em'} fontFamily={'Anton'} fontSize={'2em'}>Costo: </Text>
                                    <Text fontFamily={'Anton'} fontSize={'2em'}>{stockItem.producto.costo} $</Text>
                                    <Text ml={'4em'} fontFamily={'Anton'} fontSize={'2em'}>{stockItem.producto.cantidadUnidad}</Text>
                                    <Icon ml={'2em'} boxSize={'2em'} as={get_UnitsIcon(stockItem.producto.tipoUnidades)}/>
                                </HStack>
                                <Text></Text>

                            </Flex>
                        </Flex>

                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default StockPage;