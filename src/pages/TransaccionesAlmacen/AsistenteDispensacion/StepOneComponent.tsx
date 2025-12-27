import {useState} from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import {DispensacionDTO} from '../types';

interface Props {
    setActiveStep: (step:number) => void;
    setDispensacion: (dto: DispensacionDTO) => void;
}

export default function StepOneComponent({setActiveStep, setDispensacion}: Props){
    const toast = useToast();
    const [opId, setOpId] = useState('');

    const onBuscar = async () => {
        if(!opId){
            toast({ title: 'Error', description: 'Ingrese un ID de orden de producción', status:'error', duration:3000, isClosable:true });
            return;
        }
        try{
            const endpoint = `${EndPointsURL.getDomain()}/salidas_almacen/formulario_dispensacion_sugerida?ordenProduccionId=${opId}`;
            const resp = await axios.get<DispensacionDTO>(endpoint,{withCredentials:true});
            setDispensacion(resp.data);
            setActiveStep(1);
        }catch(err){
            toast({ title:'Orden no encontrada', description:'No existe una orden de producción con el id especificado', status:'error', duration:3000, isClosable:true });
        }
    };

    return (
        <Flex p='1em' direction='column' backgroundColor='blue.50' gap={4} alignItems='center'>
            <Heading fontFamily='Comfortaa Variable'>Identificar Orden de Producción</Heading>
            <Text fontFamily='Comfortaa Variable'>Ingrese el id de la orden de producción para continuar con la dispensación.</Text>
            <Flex w='40%' direction='column' gap={4}>
                <FormControl isRequired>
                    <FormLabel>Id Orden de Producción</FormLabel>
                    <Input value={opId} onChange={e => setOpId(e.target.value)} />
                </FormControl>
                <Button colorScheme='teal' onClick={onBuscar}>Buscar</Button>
            </Flex>
        </Flex>
    );
}
