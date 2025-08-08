/**
 * QUICKFIX TEMPORAL: Se han implementado tres mejoras para evitar el error "Cannot read properties of undefined (reading 'map')":
 * 1. En la función buscarActivos: Se usa optional chaining (?.) y valores por defecto para asegurar que data.content sea siempre un array
 * 2. En la función buscarActivos: Se inicializa activos como array vacío en caso de error
 * 3. En el JSX: Se verifica que activos sea un array antes de llamar a map()
 * 
 * Solución a largo plazo: Implementar un manejo de errores más robusto y consistente en toda la aplicación,
 * posiblemente con un componente ErrorBoundary personalizado.
 */
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
    // QUICKFIX TEMPORAL: Cambiado de 'NOMBRE' a 'POR_NOMBRE' para alinear con los valores de enum en el backend
    // El backend espera valores con prefijo "POR_" en DTO_SearchActivoFijo.TipoBusqueda
    const [tipoBusqueda, setTipoBusqueda] = useState('POR_NOMBRE');
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
                // Si tipoActivo está vacío, significa que se seleccionó "Todas las categorias"
                tipoActivo: tipoActivo && tipoActivo.trim() ? tipoActivo : null,
                soloActivos,
            };

            const resp = await axios.post(endPoints.search_activos_fijos, dto, {
                params: { page: p, size: 10 },
            });

            const data = resp.data;
            // Asegurar que content siempre sea un array
            setActivos(data?.content || []);
            setTotalPages(data?.totalPages || 0);
            setPage(data?.number || 0);
        } catch (e) {
            console.error(e);
            // Establecer activos como array vacío en caso de error para evitar el error "Cannot read properties of undefined (reading 'map')"
            setActivos([]);
            setTotalPages(0);
            setPage(0);
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
                        {/* QUICKFIX TEMPORAL: Valores actualizados con prefijo "POR_" para coincidir con el backend */}
                        <option value="POR_ID">ID</option>
                        <option value="POR_NOMBRE">Nombre</option>
                        <option value="POR_UBICACION">Ubicación</option>
                        <option value="POR_RESPONSABLE">Responsable</option>
                        <option value="POR_MARCA">Marca</option>
                        <option value="POR_CAPACIDAD">Capacidad</option>
                    </Select>
                    <Select
                        placeholder="Todas las categorias"
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
                        isLoading={loading}
                        loadingText="Buscando..."
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
                                {/* Verificar que activos sea un array antes de llamar a map() */}
                                {Array.isArray(activos) && activos.map((a) => (
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
