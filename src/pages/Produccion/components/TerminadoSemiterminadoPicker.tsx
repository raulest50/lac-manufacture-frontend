import {useCallback, useEffect, useMemo, useState, type KeyboardEvent} from 'react';
import {
    Badge,
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import {Producto, ProductoWithInsumos, InsumoWithStock} from '../types';

interface TerminadoSemiterminadoPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (producto: ProductoWithInsumos, canProduce: boolean) => void;
}

interface SearchResponse<T> {
    content?: T[];
    totalPages?: number;
    number?: number;
}

const endpoints = new EndPointsURL();

export default function TerminadoSemiterminadoPicker({isOpen, onClose, onConfirm}: TerminadoSemiterminadoPickerProps) {
    const toast = useToast();
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<Producto[]>([]);
    const [selected, setSelected] = useState<Producto | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const resetState = useCallback(() => {
        setSearchText('');
        setResults([]);
        setSelected(null);
        setPage(0);
        setTotalPages(1);
        setIsLoading(false);
        setIsConfirming(false);
    }, []);

    const fetchProductos = useCallback(async (pageToFetch = 0) => {
        setIsLoading(true);
        try {
            const response = await axios.get<SearchResponse<Producto> | Producto[]>(endpoints.search_semiytermi, {
                params: {searchTerm: searchText ?? '', page: pageToFetch}
            });
            const data = response.data as SearchResponse<Producto> | Producto[];
            if (Array.isArray(data)) {
                setResults(data);
                setTotalPages(1);
                setPage(0);
            } else {
                const items = data.content ?? [];
                setResults(items);
                setTotalPages(data.totalPages ?? 1);
                setPage(data.number ?? pageToFetch);
            }
        } catch (error) {
            console.error('Error fetching productos terminados y semiterminados', error);
            setResults([]);
            setTotalPages(1);
            toast({
                title: 'Error al buscar productos',
                description: 'No se pudo obtener la lista de productos. Intente nuevamente.',
                status: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [searchText, toast]);

    useEffect(() => {
        if (isOpen) {
            fetchProductos(0);
        } else {
            resetState();
        }
    }, [isOpen, fetchProductos, resetState]);

    const handleSearch = useCallback(() => {
        fetchProductos(0);
    }, [fetchProductos]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const handleSelect = (producto: Producto) => {
        setSelected(producto);
    };

    const handleConfirm = async () => {
        if (!selected) return;
        setIsConfirming(true);
        try {
            const url = endpoints.insumos_with_stock.replace('{id}', encodeURIComponent(String(selected.productoId)));
            const response = await axios.get<InsumoWithStock[] | SearchResponse<InsumoWithStock>>(url);
            const data = response.data;
            let insumos: InsumoWithStock[];
            if (Array.isArray(data)) {
                insumos = data;
            } else {
                insumos = data.content ?? [];
            }
            const productoWithInsumos: ProductoWithInsumos = {
                producto: selected,
                insumos
            };
            const canProduce = insumos.every(insumo => insumo.stockActual >= insumo.cantidadRequerida);
            onConfirm(productoWithInsumos, canProduce);
            resetState();
            onClose();
        } catch (error) {
            console.error('Error fetching insumos for producto', error);
            toast({
                title: 'Error al obtener insumos',
                description: 'No se pudo obtener la información de insumos del producto seleccionado.',
                status: 'error'
            });
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        resetState();
        onClose();
    };

    const paginationLabel = useMemo(() => {
        if (totalPages <= 1) return null;
        return `Página ${page + 1} de ${totalPages}`;
    }, [page, totalPages]);

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} size='xl'>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Seleccionar producto</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Flex mb={4} gap={2}>
                        <Input
                            placeholder='Buscar por nombre o código'
                            value={searchText}
                            onChange={event => setSearchText(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleSearch} isLoading={isLoading} loadingText='Buscando'>
                            Buscar
                        </Button>
                    </Flex>
                    <VStack align='stretch' spacing={2} maxH='320px' overflowY='auto'>
                        {isLoading ? (
                            <Flex justify='center' py={12}>
                                <Spinner/>
                            </Flex>
                        ) : results.length === 0 ? (
                            <Text color='gray.500'>No se encontraron productos.</Text>
                        ) : (
                            results.map(producto => {
                                const isSelected = selected?.productoId === producto.productoId;
                                return (
                                    <Box
                                        key={producto.productoId}
                                        borderWidth='1px'
                                        borderRadius='md'
                                        p={3}
                                        cursor='pointer'
                                        bg={isSelected ? 'blue.50' : 'white'}
                                        borderColor={isSelected ? 'blue.400' : 'gray.200'}
                                        _hover={{bg: 'gray.50'}}
                                        onClick={() => handleSelect(producto)}
                                    >
                                        <Flex justify='space-between' align='start'>
                                            <Box>
                                                <Text fontWeight='semibold'>{producto.nombre}</Text>
                                                <Text fontSize='sm' color='gray.600'>ID: {producto.productoId}</Text>
                                            </Box>
                                            {producto.tipo_producto && (
                                                <Badge colorScheme='purple'>{producto.tipo_producto}</Badge>
                                            )}
                                        </Flex>
                                    </Box>
                                );
                            })
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter justifyContent='space-between'>
                    <Flex align='center' gap={3}>
                        {paginationLabel && <Text fontSize='sm' color='gray.600'>{paginationLabel}</Text>}
                        {totalPages > 1 && (
                            <Flex gap={2}>
                                <Button size='sm' onClick={() => fetchProductos(page - 1)} isDisabled={page <= 0}>
                                    Anterior
                                </Button>
                                <Button size='sm' onClick={() => fetchProductos(page + 1)} isDisabled={page >= totalPages - 1}>
                                    Siguiente
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Flex gap={3}>
                        <Button variant='ghost' onClick={handleCancel} isDisabled={isConfirming}>
                            Cancelar
                        </Button>
                        <Button
                            colorScheme='blue'
                            onClick={handleConfirm}
                            isDisabled={!selected}
                            isLoading={isConfirming}
                            loadingText='Cargando insumos'
                        >
                            Confirmar
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
