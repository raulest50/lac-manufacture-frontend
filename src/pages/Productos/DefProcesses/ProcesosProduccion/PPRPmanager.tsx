import {Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper} from '@chakra-ui/react';
import {useState} from 'react';
import {RecursoProduccion} from '../../types.tsx';
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
    // Asignar cantidad inicial de 1 a cada recurso nuevo
    const nuevosRecursos = lista.map(r => ({...r, cantidad: 1}));
    onChange([...recursos, ...nuevosRecursos]);
  };

  const handleCantidadChange = (id: number | undefined, nuevaCantidad: number) => {
    if (!id) return;

    // Asegurar que la cantidad no sea menor a 1
    const cantidad = Math.max(1, nuevaCantidad);

    // Verificar que no exceda la cantidad de activos fijos disponibles
    const recurso = recursos.find(r => r.id === id);
    if (recurso && recurso.cantidadDisponible && cantidad > recurso.cantidadDisponible) {
      // No permitir exceder la cantidad disponible
      return;
    }

    onChange(recursos.map(r => 
      r.id === id ? {...r, cantidad} : r
    ));
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
            <Th>Cantidad</Th>
            <Th>Disponibles</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {recursos.map(r=> (
            <Tr key={r.id}>
              <Td>{r.id}</Td>
              <Td>{r.nombre}</Td>
              <Td>
                <NumberInput 
                  size="sm" 
                  min={1} 
                  max={r.cantidadDisponible || 999} 
                  value={r.cantidad || 1}
                  onChange={(_, valueAsNumber) => handleCantidadChange(r.id, valueAsNumber)}
                  isDisabled={!editMode}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
              <Td>{r.cantidadDisponible || 'N/A'}</Td>
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
