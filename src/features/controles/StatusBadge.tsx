import { Badge, type BadgeProps } from "@chakra-ui/react";

import type { EstadoControlRequerido, EstadoDesviacionControl } from "./types";
import { formatEnumLabel } from "./controlUi";

const paletteFor = (status?: string | null): BadgeProps["colorPalette"] => {
    if (["CONFORME", "VIGENTE", "CERRADA", "LIBERADO", "APROBADO"].includes(status ?? "")) return "green";
    if (["NO_CONFORME", "ABIERTA", "RECHAZADO"].includes(status ?? "")) return "red";
    if (["PENDIENTE", "POR_REVALIDAR", "BORRADOR", "EN_INVESTIGACION", "RESUELTA"].includes(status ?? "")) return "orange";
    if (status === "ACEPTADO_POR_DESVIACION") return "purple";
    return "gray";
};

export default function StatusBadge({ status }: {
    status?: EstadoControlRequerido | EstadoDesviacionControl | string | null;
}) {
    return (
        <Badge colorPalette={paletteFor(status)} variant="subtle">
            {status ? formatEnumLabel(status) : "SIN ESTADO"}
        </Badge>
    );
}
