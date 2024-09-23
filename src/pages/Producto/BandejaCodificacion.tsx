

import {useState} from 'react'

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    GridItem,
    HStack,
    IconButton,
    Input, Select,
    SimpleGrid,
    Textarea,
    VStack
} from "@chakra-ui/react";

import NormalStyle from "../../styles/CustomStyles";


import {FaSearch} from "react-icons/fa";



import {UNIDADES} from "../../models/constants.tsx";


function BandejaCodificacion(){

    type MateriaPrima = {
        referencia: number;
        descripcion: string;
        costo: number;
        cantidad: number;
        tipoUnidades: string;
        contenidoPorUnidad: number;
        fechaCreacion: Date;
        observaciones: string;
    };


    // states para codificar materia prima
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tipo_unidad, setTipo_unidad] = useState(UNIDADES.KG);
    const [cantidad_unidad, setCantidad_unidad] = useState('');


    const clearMP_Cod_Fields = () => {
        setNombre('');
        setCosto('');
        setObservaciones('');
        setCantidad_unidad('');
    };

    return(
        <>
            <VStack w={'full'} h={'full'} spacing={4}>
                {/*descripcion input*/}
                <SimpleGrid w={'full'} h={'full'} columns={3} gap={'2em'}>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel>Descripcion</FormLabel>
                            <Input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                sx={NormalStyle.input_style}/>
                        </FormControl>
                    </GridItem>

                    {/*costo input*/}
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Costo</FormLabel>
                            <Input
                                value={costo}
                                onChange={(e) => setCosto(e.target.value)}
                                sx={NormalStyle.input_style}/>
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel>Proveedor</FormLabel>
                            <HStack>
                                <IconButton
                                    aria-label='Search Proveedor'
                                    icon={<FaSearch color={'black'}/>}
                                    onClick={ () =>{

                                    }}
                                    colorScheme={'blue'}
                                    fontSize={{ base: "1.2em", md: "2em", lg: "2.8m", xl:"3.5em" }}  // Responsive font size
                                    p={'0.5em'}
                                    size={"lg"}
                                />
                                <Input
                                    isReadOnly
                                    sx={NormalStyle.input_style}
                                />
                            </HStack>
                        </FormControl>
                    </GridItem>


                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Url Ficha Tecnica</FormLabel>
                            <Input
                                sx={NormalStyle.input_style}
                            />
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
            <Button m={5} colorScheme={'orange'} onClick={clearMP_Cod_Fields}>{"Borrar Campos"}</Button>
        </>
    );
}

export default BandejaCodificacion