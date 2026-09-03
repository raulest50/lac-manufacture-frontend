import {
    Alert,
    Badge,
    Box,
    Button,
    Field,
    Flex,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Spinner,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { useAppToast } from "../../components/ui/use-app-toast";
import { apiFailureDetail, type ControlDomainApi } from "./api";
import { CONTROL_NOUN, contextOrderLabel, formatControlDate, formatDecimalScale } from "./controlUi";
import StatusBadge from "./StatusBadge";
import type { EjecucionControl, HistorialControlItem, HistorialFilters, PageResponse } from "./types";

export default function HistorialControlTab({ api }: { api: ControlDomainApi }) {
    const toast = useAppToast();
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [resultStatus, setResultStatus] = useState("");
    const [result, setResult] = useState<PageResponse<HistorialControlItem> | null>(null);
    const [detail, setDetail] = useState<EjecucionControl | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const load = async (page = 0) => {
        setLoading(true);
        try {
            const filters: HistorialFilters = {
                search: search.trim() || undefined,
                fechaDesde: dateFrom || undefined,
                fechaHasta: dateTo || undefined,
                resultado: (resultStatus || undefined) as HistorialFilters["resultado"],
                page,
                size: 20,
            };
            setResult(await api.listHistorial(filters));
            setDetail(null);
        } catch (error) {
            toast({ title: "No fue posible consultar el historial", description: apiFailureDetail(error, "Error de consulta.").message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        api.listHistorial({ page: 0, size: 20 })
            .then((next) => mounted && setResult(next))
            .catch((error) => mounted && toast({ title: "No fue posible consultar el historial", description: apiFailureDetail(error, "Error de consulta.").message, status: "error" }))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [api, toast]);

    const openDetail = async (id: number) => {
        setLoadingDetail(true);
        try {
            setDetail(await api.getEjecucion(id));
        } catch (error) {
            toast({ title: "No fue posible cargar la ejecución", description: apiFailureDetail(error, "Error de consulta.").message, status: "error" });
        } finally {
            setLoadingDetail(false);
        }
    };

    const groupedSamples = useMemo(() => {
        const groups = new Map<number, EjecucionControl["muestras"]>();
        for (const sample of detail?.muestras ?? []) {
            groups.set(sample.caracteristicaId, [...(groups.get(sample.caracteristicaId) ?? []), sample]);
        }
        return [...groups.values()];
    }, [detail]);

    return (
        <VStack align="stretch" gap={5}>
            <Box><Heading size="md">Historial de {CONTROL_NOUN[api.ambito].plural}</Heading><Text mt={1} color="fg.muted">Las mediciones, repeticiones y resultados no conformes se conservan sin sobrescritura.</Text></Box>
            <Flex gap={3} align="end" flexWrap="wrap">
                <Field.Root flex="1" minW={{ base: "full", md: "240px" }}><Field.Label>Buscar</Field.Label><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void load()} placeholder="Lote, producto, plan o usuario" /></Field.Root>
                <Field.Root w={{ base: "full", sm: "170px" }}><Field.Label>Desde</Field.Label><Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></Field.Root>
                <Field.Root w={{ base: "full", sm: "170px" }}><Field.Label>Hasta</Field.Label><Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></Field.Root>
                <Field.Root w={{ base: "full", sm: "220px" }}><Field.Label>Resultado original</Field.Label><NativeSelect.Root><NativeSelect.Field value={resultStatus} onChange={(event) => setResultStatus(event.target.value)}><option value="">Todos</option><option value="CONFORME">Conforme</option><option value="NO_CONFORME">No conforme</option></NativeSelect.Field><NativeSelect.Indicator /></NativeSelect.Root></Field.Root>
                <Button loading={loading} onClick={() => void load()}>Buscar</Button>
            </Flex>

            <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
                <Table.Root size="sm" minW="940px">
                    <Table.Header><Table.Row><Table.ColumnHeader>Fecha</Table.ColumnHeader><Table.ColumnHeader>Orden / lote</Table.ColumnHeader><Table.ColumnHeader>Plan</Table.ColumnHeader><Table.ColumnHeader>Resultado</Table.ColumnHeader><Table.ColumnHeader>Registrado por</Table.ColumnHeader><Table.ColumnHeader>Trazabilidad</Table.ColumnHeader><Table.ColumnHeader /></Table.Row></Table.Header>
                    <Table.Body>{result?.content.map((item) => <Table.Row key={item.id}><Table.Cell>{formatControlDate(item.fechaRegistro)}</Table.Cell><Table.Cell><Text>{contextOrderLabel(item.contexto.tipoOrden, item.contexto.ordenId)}</Text><Text fontSize="sm" color="fg.muted">{item.contexto.lote} · {item.contexto.productoId}</Text><Text fontSize="xs" color="fg.muted">{item.contexto.productoNombre}</Text></Table.Cell><Table.Cell><Text fontWeight="semibold">{item.planCodigo}</Text><Text fontSize="sm">{item.planNombre} · v{item.versionNumero}</Text><Text fontSize="xs" color="fg.muted">{item.contexto.procesoProduccionNombre ?? item.contexto.areaOperativaNombre ?? "Lote final"}{item.contexto.etapaNombre ? ` · ${item.contexto.etapaNombre}` : ""}</Text></Table.Cell><Table.Cell><StatusBadge status={item.estado} /></Table.Cell><Table.Cell>{item.usuarioNombreCompleto || item.usuarioUsername}</Table.Cell><Table.Cell><HStack>{item.repeticionDeId && <Badge colorPalette="blue">Repite #{item.repeticionDeId}</Badge>}{item.tieneDesviacion && <Badge colorPalette="red">Con desviación</Badge>}</HStack></Table.Cell><Table.Cell textAlign="end"><Button size="xs" variant="outline" loading={loadingDetail && detail?.id !== item.id} onClick={() => void openDetail(item.id)}>Ver mediciones</Button></Table.Cell></Table.Row>)}</Table.Body>
                </Table.Root>
                {!loading && result?.content.length === 0 && <Alert.Root status="info" m={4}><Alert.Indicator />No se encontraron ejecuciones.</Alert.Root>}
                {loading && !result && <HStack justify="center" py={8}><Spinner size="sm" /><Text>Cargando…</Text></HStack>}
            </Box>

            {result && result.totalPages > 1 && <HStack justify="flex-end"><Button size="sm" disabled={result.number === 0} onClick={() => void load(result.number - 1)}>Anterior</Button><Text fontSize="sm">Página {result.number + 1} de {result.totalPages}</Text><Button size="sm" disabled={result.number + 1 >= result.totalPages} onClick={() => void load(result.number + 1)}>Siguiente</Button></HStack>}

            {detail && <Box borderWidth="1px" borderRadius="lg" p={{ base: 3, md: 5 }}><HStack justify="space-between" align="start" gap={3} flexWrap="wrap" mb={4}><Box><Heading size="sm">Ejecución #{detail.id} · {detail.planCodigo}</Heading><Text color="fg.muted">{detail.contexto.lote} · {formatControlDate(detail.fechaRegistro)} · {detail.usuarioNombreCompleto || detail.usuarioUsername}</Text></Box><StatusBadge status={detail.estado} /></HStack>{detail.motivoRepeticion && <Alert.Root status="info" mb={4}><Alert.Indicator /><Box><Text fontWeight="semibold">Motivo de repetición</Text><Text>{detail.motivoRepeticion}</Text></Box></Alert.Root>}<VStack align="stretch" gap={4}>{groupedSamples.map((samples) => <Box key={samples[0].caracteristicaId} borderWidth="1px" borderRadius="md" overflowX="auto"><Box p={3}><Text fontWeight="semibold">{samples[0].caracteristicaNombre}</Text><Text fontSize="sm" color="fg.muted">{samples[0].tipo === "NUMERICA" ? `Objetivo ${samples[0].objetivo == null ? "—" : formatDecimalScale(samples[0].objetivo, samples[0].escalaVisible)} · límites ${samples[0].limiteInferior == null ? "−∞" : formatDecimalScale(samples[0].limiteInferior, samples[0].escalaVisible)} a ${samples[0].limiteSuperior == null ? "+∞" : formatDecimalScale(samples[0].limiteSuperior, samples[0].escalaVisible)} ${samples[0].unidadSimbolo ?? ""}` : `Esperado: ${samples[0].valorBooleanoEsperado ? "Sí" : "No"}`}</Text></Box><Table.Root size="sm"><Table.Header><Table.Row><Table.ColumnHeader>Muestra</Table.ColumnHeader><Table.ColumnHeader>Lecturas conservadas</Table.ColumnHeader></Table.Row></Table.Header><Table.Body>{samples.map((sample) => <Table.Row key={sample.id}><Table.Cell>{sample.numeroMuestra}</Table.Cell><Table.Cell><HStack flexWrap="wrap">{sample.lecturas.map((reading) => <Badge key={reading.id} variant="outline" colorPalette={reading.conforme ? "green" : "red"}>{reading.indiceUnidad}: {sample.tipo === "NUMERICA" ? `${reading.valorNumerico == null ? "—" : formatDecimalScale(reading.valorNumerico, sample.escalaVisible)} ${sample.unidadSimbolo ?? ""}` : reading.valorBooleano ? "Sí" : "No"}</Badge>)}</HStack></Table.Cell></Table.Row>)}</Table.Body></Table.Root></Box>)}</VStack>{detail.observaciones && <Box mt={4}><Text fontWeight="semibold">Observaciones</Text><Text>{detail.observaciones}</Text></Box>}</Box>}
        </VStack>
    );
}
