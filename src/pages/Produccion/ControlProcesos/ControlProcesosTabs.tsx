import DesviacionesControlTab from "../../../features/controles/DesviacionesControlTab";
import HistorialControlTab from "../../../features/controles/HistorialControlTab";
import PendientesControlTab from "../../../features/controles/PendientesControlTab";
import PlanesControlTab from "../../../features/controles/PlanesControlTab";
import { processControlApi } from "../../../features/controles/api";
import { useControlPermission, useExactControlPermission } from "../../../features/controles/useControlPermission";
import { Modulo } from "../../Usuarios/GestionUsuarios/types";

export function PlanesControlProcesoTab() {
    const { nivel } = useControlPermission(Modulo.PRODUCCION, "PLANES_CONTROL_PROCESO");
    return <PlanesControlTab api={processControlApi} nivel={nivel} />;
}

export function PendientesControlProcesoTab() {
    const { nivel } = useExactControlPermission(Modulo.PRODUCCION, "REGISTRAR_CONTROL_PROCESO");
    return <PendientesControlTab api={processControlApi} nivel={nivel} />;
}

export function DesviacionesControlProcesoTab() {
    const { nivel } = useExactControlPermission(Modulo.PRODUCCION, "DESVIACIONES_CONTROL_PROCESO");
    return <DesviacionesControlTab api={processControlApi} nivel={nivel} />;
}

export function HistorialControlesProcesoTab() {
    return <HistorialControlTab api={processControlApi} />;
}
