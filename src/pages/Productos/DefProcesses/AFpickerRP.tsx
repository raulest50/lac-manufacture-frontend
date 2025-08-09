import {Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL.tsx';
import {ActivoFijo} from '../../ActivosFijos/types.tsx';
import MyPagination from '../../../components/MyPagination.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (activos: ActivoFijo[]) => void;
  alreadySelected: ActivoFijo[];
}

export default function AFpickerRP({isOpen, onClose, onConfirm, alreadySelected}: Props){
  const endpoints = new EndPointsURL();
  const [searchText, setSearchText] = useState('');
  const [available, setAvailable] = useState<ActivoFijo[]>([]);
  const [selected, setSelected] = useState<ActivoFijo[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchAvailable = async (pageNumber:number) => {
    setLoading(true);
    const dto = {nombreBusqueda: searchText, page: pageNumber, size: pageSize};
    try{
      const res = await axios.post(endpoints.activos_fijos_disponibles_rp, dto);
      let list:ActivoFijo[] = res.data.content || [];
      const ids = new Set([...alreadySelected, ...selected].map(a=>a.id));
      list = list.filter(a=>!ids.has(a.id));
      setAvailable(list);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    }catch(e){
      setAvailable([]);
      setTotalPages(1);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ if(isOpen) fetchAvailable(0); }, [isOpen]);

  const handleAdd = (af:ActivoFijo) => {
    setSelected([...selected, af]);
    setAvailable(available.filter(a=>a.id!==af.id));
  };

  const handleRemove = (af:ActivoFijo) => {
    const newSel = selected.filter(a=>a.id!==af.id);
    setSelected(newSel);
    fetchAvailable(page);
  };

  const handleAccept = () => {
    onConfirm(selected);
    setSelected([]);
    setAvailable([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar Activos Fijos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4}>
            <Box flex={1}>
              <Flex mb={2} gap={2}>
                <Input placeholder='Buscar' value={searchText} onChange={(e)=>setSearchText(e.target.value)} />
                <Button 
                  onClick={()=>fetchAvailable(0)} 
                  isLoading={loading} 
                  loadingText="Buscando..."
                >
                  Buscar
                </Button>
              </Flex>
              <Table size='sm'>
                <Thead><Tr><Th>ID</Th><Th>Nombre</Th><Th></Th></Tr></Thead>
                <Tbody>
                  {available.map(af=> (
                    <Tr key={af.id}>
                      <Td>{af.id}</Td>
                      <Td>{af.nombre}</Td>
                      <Td><Button size='xs' onClick={()=>handleAdd(af)}>+</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {totalPages>1 && (
                <MyPagination page={page} totalPages={totalPages} loading={loading} handlePageChange={fetchAvailable} />
              )}
            </Box>
            <Box flex={1}>
              <Table size='sm'>
                <Thead><Tr><Th>ID</Th><Th>Nombre</Th><Th></Th></Tr></Thead>
                <Tbody>
                  {selected.map(af=> (
                    <Tr key={af.id}>
                      <Td>{af.id}</Td>
                      <Td>{af.nombre}</Td>
                      <Td><Button size='xs' colorScheme='red' onClick={()=>handleRemove(af)}>-</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme='teal' onClick={handleAccept}>Aceptar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
