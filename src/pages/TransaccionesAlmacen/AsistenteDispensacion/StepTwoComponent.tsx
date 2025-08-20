import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Table,
    Tbody,
    Td,
    Text,
    Tr
} from '@chakra-ui/react';
import {DispensacionDTO} from '../types';

interface Props {
    setActiveStep: (step:number)=>void;
    dispensacion: DispensacionDTO | null;
    setDispensacion: (dto: DispensacionDTO) => void;
}

export default function StepTwoComponent({setActiveStep, dispensacion, setDispensacion}: Props){
    if(!dispensacion){
        return <Text>No se ha cargado ninguna orden.</Text>;
    }

    const handleCantidadChange = (idx:number, value:number) => {
        const items = dispensacion.items.map((it,i)=> i===idx ? {...it, cantidad:value} : it);
        setDispensacion({...dispensacion, items});
    };

    return (
        <Box p='1em' bg='blue.50'>
            <Flex direction='column' gap={4} align='center'>
                <Heading fontFamily='Comfortaa Variable'>Dispensación Sugerida</Heading>
                <Table size='sm'>
                    <Tbody>
                        {dispensacion.items.map((item,idx)=>(
                            <Tr key={idx}>
                                <Td>{item.producto.nombre}</Td>
                                <Td>{item.lote.batchNumber}</Td>
                                <Td>{item.cantidadSugerida}</Td>
                                <Td>
                                    <Input
                                        type='number'
                                        value={item.cantidad}
                                        onChange={e=>handleCantidadChange(idx, parseFloat(e.target.value))}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <Flex w='40%' gap={4}>
                    <Button flex='1' onClick={()=>setActiveStep(0)}>Atrás</Button>
                    <Button flex='1' colorScheme='teal' onClick={()=>setActiveStep(2)}>Continuar</Button>
                </Flex>
            </Flex>
        </Box>
    );
}
