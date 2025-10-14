// src/components/HistorialOrdenesSeguimiento.tsx

import { useState } from "react";
import {
    Button,
    Flex,
    Select,
    VStack,
    Spinner,
    Text,
} from "@chakra-ui/react";
import DateRangePicker from "../../components/DateRangePicker";
import MyPagination from "../../components/MyPagination";
import OrdenProduccionCard from "./OrdenProduccionCard"; // Adjust the path as needed
import axios from "axios";
import { OrdenProduccionDTO, OrdenSeguimientoDTO } from "./types"; // Adjust the path as needed
import { format } from "date-fns";
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

const toNullableString = (value: unknown): string | null => {
    if (value === null || value === undefined) {
        return null;
    }

    const stringValue = String(value);
    return stringValue.trim().length > 0 ? stringValue : null;
};

const toNullableNumber = (value: unknown): number | null => {
    if (value === null || value === undefined) {
        return null;
    }

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
};

const normalizeOrdenSeguimiento = (seguimiento: unknown): OrdenSeguimientoDTO | null => {
    if (!seguimiento || typeof seguimiento !== "object") {
        return null;
    }

    const seg = seguimiento as Partial<OrdenSeguimientoDTO> & {
        seguimientoId?: unknown;
        insumoNombre?: unknown;
        cantidadRequerida?: unknown;
        estado?: unknown;
    };

    if (typeof seg.seguimientoId !== "number") {
        return null;
    }

    return {
        seguimientoId: seg.seguimientoId,
        insumoNombre: toNullableString(seg.insumoNombre) ?? "",
        cantidadRequerida: Number(seg.cantidadRequerida ?? 0),
        estado: Number(seg.estado ?? 0),
    };
};

const normalizeOrdenProduccion = (orden: any): OrdenProduccionDTO => {
    const ordenesSeguimiento = Array.isArray(orden?.ordenesSeguimiento)
        ? (orden.ordenesSeguimiento as unknown[])
              .map(normalizeOrdenSeguimiento)
              .filter((item): item is OrdenSeguimientoDTO => item !== null)
        : [];

    return {
        ordenId: Number(orden?.ordenId ?? 0),
        productoNombre: toNullableString(orden?.productoNombre) ?? "",
        fechaInicio: toNullableString(orden?.fechaInicio),
        fechaLanzamiento: toNullableString(orden?.fechaLanzamiento),
        fechaFinalPlanificada: toNullableString(orden?.fechaFinalPlanificada),
        estadoOrden: Number(orden?.estadoOrden ?? 0),
        numeroLotes: toNullableNumber(orden?.numeroLotes),
        numeroPedidoComercial: toNullableString(orden?.numeroPedidoComercial),
        areaOperativa: toNullableString(orden?.areaOperativa),
        departamentoOperativo: toNullableString(orden?.departamentoOperativo),
        observaciones: toNullableString(orden?.observaciones),
        ordenesSeguimiento,
    };
};

export default function HistorialOrdenes() {
    const [date1, setDate1] = useState(format(new Date(), "yyyy-MM-dd"));
    const [date2, setDate2] = useState(format(new Date(), "yyyy-MM-dd"));

    const [searchParamState, setSearchParamState] = useState("0");

    const [ordenes, setOrdenes] = useState<OrdenProduccionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(5); // You can make this dynamic if needed
    const [totalPages, setTotalPages] = useState<number>(0);

    const handleClickSearch = async () => {
        setLoading(true);
        setError(null);
        setPage(0); // Reset to first page on new search

        try {
            const response = await axios.get(endPoints.search_ordenes_within_range, {
                params: {
                    startDate: `${date1}T00:00:00`, // Adjust the format if needed
                    endDate: `${date2}T23:59:59`, // Adjust the format if needed
                    estadoOrden: searchParamState,
                    page: 0,
                    size: size,
                },
            });

            const normalizedContent: OrdenProduccionDTO[] = Array.isArray(response.data.content)
                ? response.data.content.map(normalizeOrdenProduccion)
                : [];

            setOrdenes(normalizedContent);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Error fetching Ordenes de Producción");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdenes = async (currentPage: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(endPoints.search_ordenes_within_range, {
                params: {
                    startDate: `${date1}T00:00:00`, // Adjust the format if needed
                    endDate: `${date2}T23:59:59`, // Adjust the format if needed
                    estadoOrden: searchParamState,
                    page: currentPage,
                    size: size,
                },
            });

            const normalizedContent: OrdenProduccionDTO[] = Array.isArray(response.data.content)
                ? response.data.content.map(normalizeOrdenProduccion)
                : [];

            setOrdenes(normalizedContent);
            setTotalPages(response.data.totalPages);
            setPage(currentPage);
        } catch (err) {
            setError("Error fetching Ordenes de Producción");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchOrdenes(newPage);
        }
    };

    return (
        <Flex direction={"column"} p={4}>
            <Flex direction={"row"} mb={4} align="center">
                <DateRangePicker
                    date1={date1}
                    setDate1={setDate1}
                    date2={date2}
                    setDate2={setDate2}
                    flex_direction={"column"}
                />
                <Select
                    value={searchParamState}
                    onChange={(e) => setSearchParamState(e.target.value)}
                    ml={4}
                    width="200px"
                >
                    <option value="0">Solo Ordenes Activas</option>
                    <option value="1">Solo Ordenes Cerradas</option>
                    <option value="2">Todas</option>
                </Select>
                <Button
                    onClick={handleClickSearch}
                    colorScheme={"blue"}
                    ml={4}
                    isLoading={loading}
                >
                    Buscar
                </Button>
            </Flex>

            {/* Display Loading Spinner */}
            {loading && (
                <Flex justify="center" align="center" my={4}>
                    <Spinner size="xl" />
                </Flex>
            )}

            {/* Display Error Message */}
            {error && (
                <Text color="red.500" mb={4}>
                    {error}
                </Text>
            )}

            {/* Display List of Ordenes ProduccionPage */}
            <VStack spacing={4} align="stretch">
                {ordenes.map((orden) => (
                    <OrdenProduccionCard key={orden.ordenId} ordenProduccion={orden} />
                ))}
            </VStack>

            {/* Pagination Component */}
            <MyPagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                handlePageChange={handlePageChange}
            />
        </Flex>
    );
}
