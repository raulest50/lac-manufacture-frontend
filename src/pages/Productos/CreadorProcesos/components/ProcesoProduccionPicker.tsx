import {useEffect, useState} from 'react';
import {Flex, Select, useToast} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../../api/EndPointsURL';
import {ProcesoProduccionEntity} from '../../types';
import MyPagination from '../../../../components/MyPagination';

interface Props {
    onSelect?: (proceso: ProcesoProduccionEntity | null) => void;
}

export function ProcesoProduccionPicker({onSelect}: Props) {
    const endPoints = new EndPointsURL();
    const toast = useToast();

    const [procesos, setProcesos] = useState<ProcesoProduccionEntity[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const fetchProcesos = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await axios.get(endPoints.get_procesos_produccion_pag, {
                params: {page: pageNumber, size: pageSize},
            });
            setProcesos(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(pageNumber);
        } catch (e) {
            toast({
                title: 'Error',
                description: 'No se pudieron obtener los procesos.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setProcesos([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesos(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const numericId = id === '' ? '' : Number(id);
        setSelectedId(numericId);
        const proceso = procesos.find(p => p.procesoId === Number(id)) || null;
        onSelect?.(proceso);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchProcesos(newPage);
        }
    };

    return (
        <Flex direction="column" w="full">
            <Select
                placeholder={loading ? 'Cargando...' : 'Seleccione un proceso'}
                value={selectedId}
                onChange={handleChange}
                isDisabled={loading}
            >
                {procesos.map(p => (
                    <option key={p.procesoId} value={p.procesoId}>
                        {p.nombre}
                    </option>
                ))}
            </Select>
            {totalPages > 1 && (
                <MyPagination
                    page={page}
                    totalPages={totalPages}
                    loading={loading}
                    handlePageChange={handlePageChange}
                />
            )}
        </Flex>
    );
}
