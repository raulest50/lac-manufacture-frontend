import { useState } from 'react';
import {
    Button,
    Checkbox,
    Container,
    Flex,
    Input,
    Select,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { format } from 'date-fns';
import EndPointsURL from '../../../api/EndPointsURL';
import MyPagination from '../../../components/MyPagination';
import { ActivoFijo, TipoActivo } from '../types';

const getEstadoText = (estado?: number) => {
    if (estado === 0) return 'Activo';
    if (estado === 1) return 'Obsoleto';
    if (estado === 2) return 'Baja';
    return '';
};

export default function ReportesActivosFijosTab() {
    const [valorBusqueda, setValorBusqueda] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('NOMBRE');
    const [tipoActivo, setTipoActivo] = useState('');
    const [soloActivos, setSoloActivos] = useState(true);
    const [activos, setActivos] = useState<ActivoFijo[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const endPoints = new EndPointsURL();

    const buscarActivos = async (p = 0) => {
        setLoading(true);
        try {
            const dto = {
                tipoBusqueda,
                valorBusqueda,
                tipoActivo: tipoActivo || null,
                soloActivos,
            };

            const resp = await axios.post(endPoints.search_activos_fijos, dto, {
                params: { page: p, size: 10 },
            });

            const data = resp.data;
            setActivos(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (p: number) => buscarActivos(p);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <Flex direction="column" p="1em" gap={4}>
                <Flex gap={2} align="center" flexWrap="wrap">
                    <Input
                        placeholder="Buscar"
                        value={valorBusqueda}
                        onChange={(e) => setValorBusqueda(e.target.value)}
                    />
                    <Select
                        value={tipoBusqueda}
                        onChange={(e) => setTipoBusqueda(e.target.value)}
                        width="200px"
                    >
                        <option value="ID">ID</option>
                        <option value="NOMBRE">Nombre</option>
                        <option value="UBICACION">Ubicación</option>
                        <option value="RESPONSABLE">Responsable</option>
                        <option value="MARCA">Marca</option>
                        <option value="CAPACIDAD">Capacidad</option>
                    </Select>
                    <Select
                        placeholder="Tipo Activo"
                        value={tipoActivo}
                        onChange={(e) => setTipoActivo(e.target.value)}
                        width="200px"
                    >
                        <option value={TipoActivo.PRODUCCION}>Producción</option>
                        <option value={TipoActivo.MOBILIARIO}>Mobiliario</option>
                        <option value={TipoActivo.EQUIPO}>Equipo</option>
                    </Select>
                    <Checkbox
                        isChecked={soloActivos}
                        onChange={(e) => setSoloActivos(e.target.checked)}
                    >
                        Solo activos
                    </Checkbox>
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        onClick={() => buscarActivos()}
                    >
                        Buscar
                    </Button>
                </Flex>

                {loading ? (
                    <Spinner mt={4} />
                ) : (
                    <>
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Nombre</Th>
                                    <Th>Tipo</Th>
                                    <Th>Ubicación</Th>
                                    <Th>Responsable</Th>
                                    <Th>Marca</Th>
                                    <Th>Capacidad</Th>
                                    <Th>Fecha Incorp.</Th>
                                    <Th>Estado</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {activos.map((a) => (
                                    <Tr key={a.id}>
                                        <Td>{a.id}</Td>
                                        <Td>{a.nombre}</Td>
                                        <Td>{a.tipo}</Td>
                                        <Td>{a.ubicacion}</Td>
                                        <Td>{a.responsable}</Td>
                                        <Td>{a.brand}</Td>
                                        <Td>{a.capacidad ?? ''}</Td>
                                        <Td>
                                            {a.fechaCodificacion
                                                ? format(
                                                      new Date(a.fechaCodificacion),
                                                      'yyyy-MM-dd'
                                                  )
                                                : ''}
                                        </Td>
                                        <Td>{getEstadoText(a.estado)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        <MyPagination
                            page={page}
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

