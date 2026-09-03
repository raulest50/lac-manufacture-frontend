import type { ModuloAccesoFE } from "../pages/Usuarios/GestionUsuarios/types.tsx";
import type { AreaResponsableSummary } from "../api/userAssignmentStatus.ts";

export type AccessSnapshot = {
    username?: string | null;
    isMasterLike: boolean;
    isAreaResponsable: boolean;
    areaResponsable: AreaResponsableSummary | null;
    moduloAccesos: ModuloAccesoFE[];
};

export type AccessRule = (access: AccessSnapshot) => boolean;
