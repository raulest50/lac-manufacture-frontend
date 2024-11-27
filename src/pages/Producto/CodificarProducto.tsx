import React, { useState } from 'react';
import {
    VStack, SimpleGrid, GridItem,
    FormControl, FormLabel, Input,
    Textarea, Button, useToast, Select, Flex
} from '@chakra-ui/react';

import { UNIDADES, TIPOS_PRODUCTOS } from '../../api/constants.tsx';
import { input_style } from '../../styles/styles_general.tsx';
import { CrearProductoHelper, MateriaPrima } from './CrearProductoHelper.tsx';

function CodificarProducto() {
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tipo_unidad, setTipo_unidad] = useState(UNIDADES.KG);
    const [cantidad_unidad, setCantidad_unidad] = useState('');

    const toast = useToast();

    const clearMP_Cod_Fields = () => {
        setNombre('');
        setCosto('');
        setObservaciones('');
        setCantidad_unidad('');
    };

    const saveMateriaPrimSubmit = async () => {
        const materiaPrima: MateriaPrima = {
            nombre,
            observaciones,
            costo,
            tipoUnidades: tipo_unidad,
            cantidadUnidad: cantidad_unidad,
            tipo_producto: TIPOS_PRODUCTOS.materiaPrima,
        };
        await CrearProductoHelper.CodificarMateriaPrima(materiaPrima, toast);
    };

    return (
        <>
            <VStack w="full" h="full" spacing={4}>
                <SimpleGrid w="full" h="full" columns={3} gap="2em">
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel>Descripcion</FormLabel>
                            <Input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                sx={input_style}
                            />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Costo</FormLabel>
                            <Input
                                value={costo}
                                onChange={(e) => setCosto(e.target.value)}
                                sx={input_style}
                            />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Url Ficha Tecnica</FormLabel>
                            <Input sx={input_style} />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel>Observaciones</FormLabel>
                            <Textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                variant="filled"
                            />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <Flex w="full" direction="row" align="flex-end" justify="space-around" gap={4}>
                            <Select
                                flex="1"
                                value={tipo_unidad}
                                onChange={(e) => setTipo_unidad(e.target.value)}
                            >
                                <option value={UNIDADES.KG}>{UNIDADES.KG}</option>
                                <option value={UNIDADES.L}>{UNIDADES.L}</option>
                                <option value={UNIDADES.U}>{UNIDADES.U}</option>
                            </Select>
                            <FormControl flex="4">
                                <FormLabel>Cantidad por Unidad</FormLabel>
                                <Input
                                    value={cantidad_unidad}
                                    onChange={(e) => setCantidad_unidad(e.target.value)}
                                    variant="filled"
                                />
                            </FormControl>
                        </Flex>
                    </GridItem>
                </SimpleGrid>
            </VStack>
            <Button m={5} colorScheme="teal" onClick={saveMateriaPrimSubmit}>
                Codificar Materia Prima
            </Button>
            <Button m={5} colorScheme="orange" onClick={clearMP_Cod_Fields}>
                Borrar Campos
            </Button>
        </>
    );
}

export default CodificarProducto;
