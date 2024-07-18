
import {useState} from 'react';
import { useToast } from '@chakra-ui/react';

import {
    Container, VStack, HStack, Flex,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input, Textarea,
    Button,
    Select,
}
from "@chakra-ui/react";
import MyHeader from "../components/MyHeader.tsx";
import {NavLink} from "react-router-dom";

import {my_style_tab} from "../styles/styles_general.tsx";

import {CAUSAS_MOVIMIENTOS} from "../models/constants.tsx";

import {SpringRequestHandler} from "../api/SpringRequestHandler.tsx";


function Stock(){

    const [id_producto, setIdProducto] = useState('');
    const [causa_movimiento, setCausaMovimiento] = useState(CAUSAS_MOVIMIENTOS.COMPRA);
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const toast = useToast();

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
                                        value={id_producto}
                                        onChange={(e) => setIdProducto(e.target.value)}
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
                                <Button colorScheme={'teal'} >Registrar Movimiento</Button>
                            </HStack>
                        </VStack>

                    </TabPanel>

                    <TabPanel>

                    </TabPanel>

                </TabPanels>
            </Tabs>

        </Container>
    );
}

export default Stock;