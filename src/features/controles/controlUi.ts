import type { AmbitoControl } from "./types";

export const CONTROL_SCOPE_LABEL: Record<AmbitoControl, string> = {
    PROCESO: "Control de proceso",
    CALIDAD: "Control de calidad",
};

export const CONTROL_OWNER_LABEL: Record<AmbitoControl, string> = {
    PROCESO: "Dirección Técnica y de Planta",
    CALIDAD: "Calidad",
};

export const CONTROL_NOUN: Record<AmbitoControl, { singular: string; plural: string; pending: string }> = {
    PROCESO: { singular: "control", plural: "controles", pending: "Controles pendientes" },
    CALIDAD: { singular: "ensayo", plural: "ensayos", pending: "Ensayos pendientes" },
};

export function formatEnumLabel(value: string) {
    return value.replace(/_/g, " ");
}

export function formatControlDate(value?: string | null) {
    if (!value) return "—";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-");
        return `${day}/${month}/${year}`;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-CO");
}

export function formatDecimalScale(value: string, scale: number) {
    const normalized = value.replace(",", ".");
    const negative = normalized.startsWith("-");
    const unsigned = negative ? normalized.slice(1) : normalized;
    const [rawInteger, fraction = ""] = unsigned.split(".");
    const integer = rawInteger.replace(/^0+(?=\d)/, "") || "0";
    const keptFraction = fraction.padEnd(scale, "0").slice(0, scale);
    let scaled = BigInt(`${integer}${keptFraction}` || "0");
    if ((fraction[scale] ?? "0") >= "5") scaled += 1n;
    const digits = scaled.toString().padStart(scale + 1, "0");
    const sign = negative && scaled !== 0n ? "-" : "";
    if (scale === 0) return `${sign}${digits}`;
    return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

export function contextOrderLabel(tipoOrden?: string, ordenId?: number | null, ordenCodigo?: string | null) {
    if (ordenCodigo) return ordenCodigo;
    if (tipoOrden && ordenId != null) return `${tipoOrden}-${ordenId}`;
    return tipoOrden ?? "—";
}
