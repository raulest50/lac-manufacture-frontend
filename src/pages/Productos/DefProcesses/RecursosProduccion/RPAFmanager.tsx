import {Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr, useToast} from '@chakra-ui/react';
import {useState} from 'react';
import axios from 'axios';
import EndPointsURL from '../../../../api/EndPointsURL.tsx';
import {ActivoFijo} from '../../../ActivosFijos/types.tsx';
import AFpickerRP from './AFpickerRP.tsx';

interface Props {
  recursoId?: number;
  activos: ActivoFijo[];
  onChange: (activos: ActivoFijo[]) => void;
  editMode?: boolean;
}

export default function RPAFmanager({recursoId, activos, onChange, editMode = true}: Props){
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const toast = useToast();
  const endpoints = new EndPointsURL();

  const unassignActivo = async (af: ActivoFijo) => {
    if(!recursoId) return;
    try{
      const getUrl = endpoints.get_activo_fijo.replace('{id}', af.id);
      const updUrl = endpoints.update_activo_fijo.replace('{id}', af.id);
      const res = await axios.get(getUrl);
      const full = res.data;
      full.tipoRecurso = null;
      await axios.put(updUrl, full);
    }catch(e){
      toast({title:'Error al desasignar activo', status:'error'});
    }
  };

  const handleRemove = async (af: ActivoFijo) => {
    if(recursoId){
      await unassignActivo(af);
    }
    onChange(activos.filter(a => a.id !== af.id));
  };

  const assignActivos = async (lista: ActivoFijo[]) => {
    if(recursoId){
      for(const af of lista){
        try{
          const getUrl = endpoints.get_activo_fijo.replace('{id}', af.id);
          const updUrl = endpoints.update_activo_fijo.replace('{id}', af.id);
          const res = await axios.get(getUrl);
          const full = res.data;
          full.tipoRecurso = {id: recursoId};
          await axios.put(updUrl, full);
        }catch(e){
          toast({title:'Error al asignar activo', status:'error'});
        }
      }
    }
    onChange([...activos, ...lista]);
  };

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Button colorScheme='teal' size='sm' onClick={()=>setIsPickerOpen(true)} isDisabled={!editMode}>Agregar Activo Fijo</Button>
      </Flex>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {activos.map(af=> (
            <Tr key={af.id}>
              <Td>{af.id}</Td>
              <Td>{af.nombre}</Td>
              <Td><Button size='xs' colorScheme='red' onClick={()=>handleRemove(af)} isDisabled={!editMode}>Remover</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AFpickerRP
        isOpen={isPickerOpen}
        onClose={()=>setIsPickerOpen(false)}
        onConfirm={(sel)=>{assignActivos(sel); setIsPickerOpen(false);}}
        alreadySelected={activos}
      />
    </Box>
  );
}
