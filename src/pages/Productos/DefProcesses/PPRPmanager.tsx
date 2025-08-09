import {Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import {useState} from 'react';
import {RecursoProduccion} from '../types.tsx';
import RecursoProduccionPicker from './RecursoProduccionPicker.tsx';

interface Props {
  recursos: RecursoProduccion[];
  onChange: (recursos: RecursoProduccion[]) => void;
  editMode?: boolean;
}

export default function PPRPmanager({recursos, onChange, editMode = true}: Props){
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleRemove = (r: RecursoProduccion) => {
    onChange(recursos.filter(a => a.id !== r.id));
  };

  const assignRecursos = (lista: RecursoProduccion[]) => {
    onChange([...recursos, ...lista]);
  };

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Button colorScheme='teal' size='sm' onClick={()=>setIsPickerOpen(true)} isDisabled={!editMode}>Agregar Recurso</Button>
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
          {recursos.map(r=> (
            <Tr key={r.id}>
              <Td>{r.id}</Td>
              <Td>{r.nombre}</Td>
              <Td><Button size='xs' colorScheme='red' onClick={()=>handleRemove(r)} isDisabled={!editMode}>Remover</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <RecursoProduccionPicker
        isOpen={isPickerOpen}
        onClose={()=>setIsPickerOpen(false)}
        onConfirm={(sel)=>{assignRecursos(sel); setIsPickerOpen(false);}}
        alreadySelected={recursos}
      />
    </Box>
  );
}

