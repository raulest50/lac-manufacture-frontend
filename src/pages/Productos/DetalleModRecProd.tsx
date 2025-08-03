import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, useToast} from '@chakra-ui/react';
import {useState} from 'react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';
import {RecursoProduccion} from './types';
import RPAFmanager from './RPAFmanager';
import {ActivoFijo} from '../ActivosFijos/types';

interface Props {
  recurso: RecursoProduccion;
  setEstado: (estado:number)=>void;
  refreshSearch?: ()=>void;
}

export default function DetalleModRecProd({recurso, setEstado, refreshSearch}:Props){
  const [editMode, setEditMode] = useState(false);
  const [recursoData, setRecursoData] = useState<RecursoProduccion>({...recurso});
  const toast = useToast();
  const endpoints = new EndPointsURL();

  const handleSave = async () => {
    const dto = {oldRecursoProduccion: recurso, newRecursoProduccion: recursoData};
    try{
      await axios.put(endpoints.update_recurso_produccion, dto);
      setEditMode(false);
      toast({title:'Recurso actualizado',status:'success',duration:3000,isClosable:true});
      if(refreshSearch) refreshSearch();
    }catch(e){
      toast({title:'Error al actualizar recurso',status:'error',duration:3000,isClosable:true});
    }
  };

  const handleActivosChange = (afs: ActivoFijo[]) => {
    setRecursoData({...recursoData, activosFijos: afs});
  };

  const handleBack = () => {
    setEstado(0);
    if(refreshSearch) refreshSearch();
  };

  return (
    <Box p={4}>
      <Button mb={4} onClick={handleBack}>Volver</Button>
      <Heading size='md' mb={4}>Detalle Recurso Producción</Heading>
      <FormControl mb={4} isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input value={recursoData.nombre} onChange={e=>setRecursoData({...recursoData, nombre:e.target.value})} isDisabled={!editMode} />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Descripción</FormLabel>
        <Input value={recursoData.descripcion} onChange={e=>setRecursoData({...recursoData, descripcion:e.target.value})} isDisabled={!editMode} />
      </FormControl>
      <RPAFmanager recursoId={recursoData.id} activos={recursoData.activosFijos || []} onChange={handleActivosChange} />
      <Flex mt={4} gap={2}>
        {editMode ? (
          <>
            <Button colorScheme='teal' onClick={handleSave}>Guardar</Button>
            <Button onClick={()=>{setEditMode(false); setRecursoData({...recurso});}}>Cancelar</Button>
          </>
        ) : (
          <Button onClick={()=>setEditMode(true)}>Editar</Button>
        )}
      </Flex>
    </Box>
  );
}

