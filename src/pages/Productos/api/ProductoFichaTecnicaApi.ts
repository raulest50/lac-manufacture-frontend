import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL";

export interface FichaTecnicaMetadata {
    disponible: boolean;
    versionVigente: FichaTecnicaVersion | null;
    totalVersiones: number;
}

export interface FichaTecnicaVersion {
    id: number;
    version: number;
    estado: "VIGENTE" | "RETIRADA";
    nombreArchivoOriginal: string;
    tamanoBytes: number | null;
    vigenteDesde: string;
    vigenteHasta: string | null;
    creadoEn: string;
    creadoPor: string | null;
    motivoCambio: string;
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
    return obtenerPdf(
        resolveEndpoint(endPoints.producto_ficha_tecnica, productoId),
        signal,
    );
}

export async function consultarFichaTecnicaVersiones(
    productoId: string,
    signal?: AbortSignal,
): Promise<FichaTecnicaVersion[]> {
    const response = await axios.get<FichaTecnicaVersion[]>(
        resolveEndpoint(endPoints.producto_ficha_tecnica_versiones, productoId),
        { signal },
    );
    return response.data;
}

export async function crearFichaTecnicaVersion(
    productoId: string,
    archivo: File,
    motivoCambio: string,
    signal?: AbortSignal,
): Promise<FichaTecnicaVersion> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    if (motivoCambio.trim()) {
        formData.append("motivoCambio", motivoCambio.trim());
    }
    const response = await axios.post<FichaTecnicaVersion>(
        resolveEndpoint(endPoints.producto_ficha_tecnica_versiones, productoId),
        formData,
        { signal },
    );
    return response.data;
}

export async function obtenerFichaTecnicaVersionPdf(
    productoId: string,
    versionId: number,
    signal?: AbortSignal,
): Promise<Blob> {
    const url = resolveEndpoint(endPoints.producto_ficha_tecnica_version_archivo, productoId)
        .replace("{versionId}", encodeURIComponent(String(versionId)));
    return obtenerPdf(url, signal);
}

async function obtenerPdf(url: string, signal?: AbortSignal): Promise<Blob> {
    const response = await axios.get<Blob>(url, { responseType: "blob", signal });
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

export function validarFichaTecnicaPdf(file: File): void {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("La ficha tecnica debe tener extension PDF.");
    }
    if (file.size === 0) {
        throw new Error("La ficha tecnica no puede estar vacia.");
    }
    if (file.size > 10 * 1024 * 1024) {
        throw new Error("La ficha tecnica no puede superar 10 MB.");
    }
}

export function fichaTecnicaErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
            return data.error;
        }
        return error.message;
    }
    return error instanceof Error ? error.message : "Ocurrio un error inesperado.";
}

export function fichaTecnicaDuplicada(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 409;
}

export function fichaTecnicaNoDisponible(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

export function solicitudFichaTecnicaCancelada(error: unknown): boolean {
    return axios.isCancel(error) || (axios.isAxiosError(error) && error.code === "ERR_CANCELED");
}
