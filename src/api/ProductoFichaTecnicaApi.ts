import axios from "axios";
import EndPointsURL from "./EndPointsURL";

export interface FichaTecnicaMetadata {
    disponible: boolean;
}

const endPoints = new EndPointsURL();

function resolveEndpoint(template: string, productoId: string): string {
    return template.replace("{productoId}", encodeURIComponent(productoId));
}

export async function consultarFichaTecnicaMetadata(
    productoId: string,
    signal?: AbortSignal,
): Promise<FichaTecnicaMetadata> {
    const response = await axios.get<FichaTecnicaMetadata>(
        resolveEndpoint(endPoints.producto_ficha_tecnica_metadata, productoId),
        { signal },
    );
    return response.data;
}

export async function obtenerFichaTecnicaPdf(
    productoId: string,
    signal?: AbortSignal,
): Promise<Blob> {
    const response = await axios.get<Blob>(
        resolveEndpoint(endPoints.producto_ficha_tecnica, productoId),
        { responseType: "blob", signal },
    );
    const rawContentType = response.headers["content-type"];
    const contentType = (typeof rawContentType === "string" ? rawContentType : response.data.type)
        .split(";", 1)[0]
        .trim()
        .toLowerCase();
    if (contentType !== "application/pdf") {
        throw new Error("El servidor no devolvio un documento PDF.");
    }
    return response.data;
}

export function fichaTecnicaNoDisponible(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

export function solicitudFichaTecnicaCancelada(error: unknown): boolean {
    return axios.isCancel(error) || (axios.isAxiosError(error) && error.code === "ERR_CANCELED");
}
