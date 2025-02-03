// ReporteOrdenesCompras.tsx
import { useState } from "react";
import { Button, Container, Flex, Select, Spinner } from "@chakra-ui/react";
import { OrdenCompra } from "./types";
import { format } from "date-fns";
import DateRangePicker from "../../components/DateRangePicker";
import axios from "axios";
import EndPointsURL from '../../api/EndPointsURL';
import ListaOrdenesCompra from "./components/ListaOrdenesCompra";
import MyPagination from "../../components/MyPagination";

export default function ReporteOrdenesCompras() {
    const [listaOrdenesCompras, setListaOrdenesCompras] = useState<OrdenCompra[]>([]);
    const [date1, setDate1] = useState(format(new Date(), "yyyy-MM-dd"));
    const [date2, setDate2] = useState(format(new Date(), "yyyy-MM-dd"));
    const [estadoOrden_search, setEstadoOrdenSearch] = useState("0,1,2");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const endPoints = new EndPointsURL();

    const onClickBuscar = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get(endPoints.search_ordenc_date_estado, {
                params: {
                    date1: date1,
                    date2: date2,
                    estados: estadoOrden_search,
                    page: page,
                    size: 10,
                },
            });
            const data = response.data;
            setListaOrdenesCompras(data.content);
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
                        value={estadoOrden_search}
                        onChange={(e) => setEstadoOrdenSearch(e.target.value)}
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
                        <ListaOrdenesCompra ordenes={listaOrdenesCompras} />
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
