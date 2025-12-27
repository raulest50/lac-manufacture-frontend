import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import {DispensacionDTO} from '../types';

interface InsumoDesglosadoDTO {
    productoId: string;
    productoNombre: string;
    cantidadTotalRequerida: number;
    tipoUnidades: string;
    tipoProducto: string;
}

interface Props {
    setActiveStep: (step:number)=>void;
    dispensacion: DispensacionDTO | null;
    setDispensacion: (dto: DispensacionDTO) => void;
    insumosDesglosados?: InsumoDesglosadoDTO[];
    ordenProduccionId?: number | null;
}

export default function StepTwoComponent({setActiveStep, dispensacion, setDispensacion, insumosDesglosados, ordenProduccionId}: Props){
    // Si hay insumos desglosados, mostrar esos; sino, usar el sistema anterior
    if(insumosDesglosados && insumosDesglosados.length > 0) {
        return (
            <Box p='1em' bg='blue.50'>
                <Flex direction='column' gap={4} align='center'>
                    <Heading fontFamily='Comfortaa Variable'>Materiales Necesarios</Heading>
                    <Text fontFamily='Comfortaa Variable' fontSize='sm' color='gray.600'>
                        Lista completa desglosada de materiales base requeridos para la orden de producción
                    </Text>
                    <Box bg='white' borderRadius='md' boxShadow='sm' overflowX='auto' w='full' maxW='1200px'>
                        <Table size='sm'>
                            <Thead>
                                <Tr>
                                    <Th>ID Producto</Th>
                                    <Th>Nombre</Th>
                                    <Th>Cantidad Requerida</Th>
                                    <Th>Unidad</Th>
                                    <Th>Tipo</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {insumosDesglosados.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={5} textAlign='center' py={4}>
                                            <Text>No hay materiales registrados</Text>
                                        </Td>
                                    </Tr>
                                ) : (
                                    insumosDesglosados.map((insumo, idx) => (
                                        <Tr key={insumo.productoId || idx}>
                                            <Td>{insumo.productoId}</Td>
                                            <Td>{insumo.productoNombre}</Td>
                                            <Td>{insumo.cantidadTotalRequerida.toFixed(2)}</Td>
                                            <Td>{insumo.tipoUnidades}</Td>
                                            <Td>{insumo.tipoProducto}</Td>
                                        </Tr>
                                    ))
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                    <Flex w='40%' gap={4}>
                        <Button flex='1' onClick={()=>setActiveStep(0)}>Atrás</Button>
                        <Button flex='1' colorScheme='teal' onClick={()=>setActiveStep(2)}>Continuar</Button>
                    </Flex>
                </Flex>
            </Box>
        );
    }

    // Sistema anterior (compatibilidad)
    if(!dispensacion){
        return <Text>No se ha cargado ninguna orden.</Text>;
    }

    return (
        <Box p='1em' bg='blue.50'>
            <Flex direction='column' gap={4} align='center'>
                <Heading fontFamily='Comfortaa Variable'>Dispensación Sugerida</Heading>
                <Text>No hay insumos disponibles para mostrar.</Text>
                <Flex w='40%' gap={4}>
                    <Button flex='1' onClick={()=>setActiveStep(0)}>Atrás</Button>
                    <Button flex='1' colorScheme='teal' onClick={()=>setActiveStep(2)}>Continuar</Button>
                </Flex>
            </Flex>
        </Box>
    );
}
