import { useState } from 'react';
import { Container, Flex, Select, Button, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { format } from 'date-fns';
import EndPointsURL from '../../../api/EndPointsURL';
import DateRangePicker from '../../../components/DateRangePicker';
import MyPagination from '../../../components/MyPagination';
import { OrdenCompraActivo } from '../types';
import ListaOrdenesOCAF from './ListaOrdenesOCAF';

export function ReportesTabAf() {
    const [listaOrdenes, setListaOrdenes] = useState<OrdenCompraActivo[]>([]);
    const [date1, setDate1] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [date2, setDate2] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [estadoSearch, setEstadoSearch] = useState('0,1,2');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const endPoints = new EndPointsURL();

    const onClickBuscar = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get(endPoints.search_ordenes_compra_activo, {
                params: {
                    date1,
                    date2,
                    estados: estadoSearch,
                    page,
                    size: 10,
                },
            });
            const data = response.data;
            setListaOrdenes(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(data.number);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        onClickBuscar(page);
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <Flex direction="column" p="1em" gap="2">
                <Flex direction="row" gap={2} align="center">
                    <DateRangePicker
                        date1={date1}
                        setDate1={setDate1}
                        date2={date2}
                        setDate2={setDate2}
                        flex_direction="column"
                    />
                    <Select
                        value={estadoSearch}
                        onChange={(e) => setEstadoSearch(e.target.value)}
                        ml={4}
                        width="200px"
                    >
                        <option value="0,1,2">Pendientes</option>
                        <option value="3">Cerradas</option>
                        <option value="-1">Canceladas</option>
                        <option value="-1,0,1,2,3">Todas</option>
                    </Select>
                    <Button variant="solid" colorScheme="teal" onClick={() => onClickBuscar()}>
                        Buscar
                    </Button>
                </Flex>

                {loading ? (
                    <Spinner mt={4} />
                ) : (
                    <>
                        <ListaOrdenesOCAF ordenes={listaOrdenes} />
                        <MyPagination
                            page={currentPage}
                            totalPages={totalPages}
                            loading={loading}
                            handlePageChange={handlePageChange}
                        />
                    </>
                )}
            </Flex>
        </Container>
    );
}

export default ReportesTabAf;
