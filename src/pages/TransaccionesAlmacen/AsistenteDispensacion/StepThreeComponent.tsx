import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Table,
    Tbody,
    Td,
    Text,
    Tr
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {DispensacionDTO} from '../types';

interface Props {
    setActiveStep: (step:number)=>void;
    dispensacion: DispensacionDTO | null;
}

export default function StepThreeComponent({setActiveStep, dispensacion}: Props){
    const [token, setToken] = useState('');
    const [inputToken, setInputToken] = useState('');

    useEffect(()=>{
        const t = Math.floor(1000 + Math.random() * 9000).toString();
        setToken(t);
        setInputToken('');
    }, [dispensacion]);

    const enviarDispensacion = async () => {
        // TODO: implementar envío al backend
    };

    if(!dispensacion){
        return <Text>No se ha cargado ninguna orden.</Text>;
    }

    return (
        <Box p='1em' bg='blue.50'>
            <Flex direction='column' gap={4} align='center'>
                <Heading fontFamily='Comfortaa Variable'>Revisar Dispensación</Heading>
                <Table size='sm'>
                    <Tbody>
                        {dispensacion.items.map((item,idx)=>(
                            <Tr key={idx}>
                                <Td>{item.producto.nombre}</Td>
                                <Td>{item.lote.batchNumber}</Td>
                                <Td>{item.cantidad}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <FormControl w='40%' isRequired>
                    <FormLabel>Token de verificación</FormLabel>
                    <Input value={inputToken} onChange={e=>setInputToken(e.target.value)} placeholder='Ingrese el token'/>
                </FormControl>
                <Text fontFamily='Comfortaa Variable'>Token: <strong>{token}</strong></Text>
                <Flex w='40%' gap={4}>
                    <Button flex='1' onClick={()=>setActiveStep(1)}>Atrás</Button>
                    <Button flex='1' colorScheme='teal' onClick={enviarDispensacion} isDisabled={inputToken !== token}>Enviar</Button>
                </Flex>
            </Flex>
        </Box>
    );
}
