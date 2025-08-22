import {Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL.tsx';
import {RecursoProduccion} from '../types.tsx';
import MyPagination from '../../../components/MyPagination.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recursos: RecursoProduccion[]) => void;
  alreadySelected: RecursoProduccion[];
}

export default function RecursoProduccionPicker({isOpen, onClose, onConfirm, alreadySelected}: Props){
  const endpoints = new EndPointsURL();
  const [searchText, setSearchText] = useState('');
  const [available, setAvailable] = useState<RecursoProduccion[]>([]);
  const [selected, setSelected] = useState<RecursoProduccion[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchAvailable = async (pageNumber:number) => {
    setLoading(true);
    const dto = {tipoBusqueda: 'POR_NOMBRE', valorBusqueda: searchText, page: pageNumber, size: pageSize};
    try{
      const res = await axios.post(endpoints.search_recurso_produccion, dto);
      let list:RecursoProduccion[] = res.data.content || [];
      const ids = new Set([...alreadySelected, ...selected].map(r=>r.id));
      list = list.filter(r=>!ids.has(r.id));
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

  const handleAdd = (r:RecursoProduccion) => {
    setSelected([...selected, r]);
    setAvailable(available.filter(a=>a.id!==r.id));
  };

  const handleRemove = (r:RecursoProduccion) => {
    const newSel = selected.filter(a=>a.id!==r.id);
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
        <ModalHeader>Seleccionar Recursos de Producción</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4}>
            <Box flex={1}>
              <Flex mb={2} gap={2}>
                <Input
                  placeholder='Buscar'
                  value={searchText}
                  onChange={(e)=>setSearchText(e.target.value)}
                  onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                      fetchAvailable(0);
                    }
                  }}
                />
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
                  {available.map(r=> (
                    <Tr key={r.id}>
                      <Td>{r.id}</Td>
                      <Td>{r.nombre}</Td>
                      <Td><Button size='xs' onClick={()=>handleAdd(r)}>+</Button></Td>
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
                  {selected.map(r=> (
                    <Tr key={r.id}>
                      <Td>{r.id}</Td>
                      <Td>{r.nombre}</Td>
                      <Td><Button size='xs' colorScheme='red' onClick={()=>handleRemove(r)}>-</Button></Td>
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

