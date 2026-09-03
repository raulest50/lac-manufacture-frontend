import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL";
import type { BatchRecordDetail, BatchRecordListItem, BatchRecordSendPrevalidation, PageResponse } from "./types";

const endpoints = new EndPointsURL();
const options = { withCredentials: true };

export async function buscarBatchRecords(params: {
    ordenProduccionId?: number;
    lote?: string;
    page?: number;
    size?: number;
}): Promise<PageResponse<BatchRecordListItem>> {
    const response = await axios.get<PageResponse<BatchRecordListItem>>(
        endpoints.produccion_batch_records,
        { ...options, params },
    );
    return response.data;
}

export async function detalleBatchRecord(id: number): Promise<BatchRecordDetail> {
    const response = await axios.get<BatchRecordDetail>(
        `${endpoints.produccion_batch_records}/${id}`,
        options,
    );
    return response.data;
}

export async function enviarBatchRecordCalidad(id: number, motivo: string): Promise<BatchRecordDetail> {
    const response = await axios.post<BatchRecordDetail>(
        `${endpoints.produccion_batch_records}/${id}/enviar-calidad`,
        { motivo },
        options,
    );
    return response.data;
}

export async function reenviarBatchRecordCalidad(id: number, motivo: string): Promise<BatchRecordDetail> {
    const response = await axios.post<BatchRecordDetail>(
        `${endpoints.produccion_batch_records}/${id}/reenviar-calidad`,
        { motivo },
        options,
    );
    return response.data;
}

export async function prevalidarEnvioBatchRecord(id: number, reenvio: boolean): Promise<BatchRecordSendPrevalidation> {
    const response = await axios.get<BatchRecordSendPrevalidation>(
        `${endpoints.produccion_batch_records}/${id}/prevalidacion-envio`,
        { ...options, params: { reenvio } },
    );
    return response.data;
}

export async function atenderSeccionCorreccion(
    id: number,
    seccionId: number,
    justificacion: string,
): Promise<BatchRecordDetail> {
    const response = await axios.post<BatchRecordDetail>(
        `${endpoints.produccion_batch_records}/${id}/secciones-correccion/${seccionId}/atender`,
        { justificacion },
        options,
    );
    return response.data;
}

export async function descargarPdfBatchRecord(
    id: number,
    revision?: number,
    actual = false,
): Promise<{ blob: Blob; filename: string }> {
    const response = await axios.get<Blob>(
        `${endpoints.produccion_batch_records}/${id}/pdf`,
        {
            ...options,
            params: {
                ...(revision == null ? {} : { revision }),
                ...(actual ? { actual: true } : {}),
            },
            responseType: "blob",
        },
    );
    const disposition = response.headers["content-disposition"] as string | undefined;
    const filename = disposition?.match(/filename="?([^";]+)"?/i)?.[1]
        ?? `batch-record-${id}.pdf`;
    return { blob: response.data, filename };
}
