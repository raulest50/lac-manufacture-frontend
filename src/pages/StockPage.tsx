
import {useState} from 'react';
import { useToast } from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input, Textarea,
    Button,
    Select,
    Text,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import {NavLink} from "react-router-dom";

import {my_style_tab} from "../styles/styles_general.tsx";

import {CAUSAS_MOVIMIENTOS} from "../models/constants.tsx";
import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";
import {Movimiento} from "../models/Movimiento.tsx";
import {Stock} from "../models/Stock.tsx"


function StockPage(){

    const [producto_id, setProductoId] = useState('');
    const [causa_movimiento, setCausaMovimiento] = useState(CAUSAS_MOVIMIENTOS.COMPRA);
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');

    
    const emptyStock: Stock = {
        cantidad_totalizada: 0,
        producto: {
            producto_id: 0,
            nombre: '',
            observaciones: '',
            costo: 0,
            fechaCreacion: '',
            tipo_unidades: '',
            cantidad_unidad: 0,
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
                producto_id:producto_id,
                tipo_producto:"M"
            },
            causa: causa_movimiento,
            observaciones: observaciones,
        };
        await SpringRequestHandler.registrarMovimiento(toast, movimiento);
    }

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
                        <VStack>
                            <FormControl>
                                <FormLabel>Producto Id</FormLabel>
                                <Input
                                    value={pid2totalize}
                                    onChange={(e) => setPid2Totalize(e.target.value)}
                                    />
                            </FormControl>
                            <FormControl>
                                <Button m={5} colorScheme={'teal'}
                                    onClick={() => SpringRequestHandler.getStockByProductoId(Number(pid2totalize), setStockItem)}
                                >
                                Calcular Stock</Button>
                            </FormControl>
                        </VStack>
                        
                        <VStack>
                            <HStack>
                                <Text>{stockItem.producto.producto_id}</Text>
                            </HStack>
                            <Text>{stockItem.producto.nombre}</Text>
                            <Text>{stockItem.cantidad_totalizada}</Text>
                        </VStack>

                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default StockPage;