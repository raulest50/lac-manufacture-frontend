import { useMemo } from "react";

import { getExactTabNivel, MASTER_EFFECTIVE_NIVEL } from "../../auth/accessHelpers";
import { useAuth } from "../../context/AuthContext";
import { Modulo } from "../../pages/Usuarios/GestionUsuarios/types";

export function useControlPermission(modulo: Modulo, tabId: string) {
    const { user, moduloAccesos, accesosReady } = useAuth();
    const level = useMemo(() => user?.toLowerCase() === "super_master"
        ? MASTER_EFFECTIVE_NIVEL
        : getExactTabNivel(moduloAccesos, modulo, tabId) ?? 0, [modulo, moduloAccesos, tabId, user]);
    return { nivel: level, ready: accesosReady };
}

export function useExactControlPermission(modulo: Modulo, tabId: string) {
    const { moduloAccesos, accesosReady } = useAuth();
    const level = useMemo(
        () => getExactTabNivel(moduloAccesos, modulo, tabId) ?? 0,
        [modulo, moduloAccesos, tabId],
    );
    return { nivel: level, ready: accesosReady };
}
