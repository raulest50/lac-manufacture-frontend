import { useState } from 'react';
import { Container, Flex, Input, Button, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../api/EndPointsURL';
import MyPagination from '../../components/MyPagination';
import ListaIntegrantes from './ListaIntegrantes';
import { IntegrantePersonal } from './types';

export function ConsultaDePersonal() {
    const [lista, setLista] = useState<IntegrantePersonal[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const endPoints = new EndPointsURL();

    const onBuscar = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get(endPoints.search_integrantes_personal, {
                params: {
                    q: searchText,
                    page,
                    size: 10,
                },
            });
            const data = response.data;
            setLista(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(data.number);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        onBuscar(page);
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <Flex direction="column" p="1em" gap="2">
                <Flex direction="row" gap={2} align="center">
                    <Input
                        placeholder="Buscar por nombre o apellido"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onBuscar();
                        }}
                    />
                    <Button variant="solid" colorScheme="teal" onClick={() => onBuscar()}>
                        Buscar
                    </Button>
                </Flex>

                {loading ? (
                    <Spinner mt={4} />
                ) : (
                    <>
                        <ListaIntegrantes integrantes={lista} />
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
