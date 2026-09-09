import {
    ACCESS_DOCUMENTATION_CATALOG,
    maxDocumentedLevel,
} from "../pages/Usuarios/GestionUsuarios/access-help/accessDocumentationCatalog.ts";
import { Modulo } from "../pages/Usuarios/GestionUsuarios/types.tsx";

export type TabDefinition = { tabId: string; label: string; maxNivel: number };

/**
 * Catálogo estructural derivado de la documentación de accesos.
 * Los identificadores deben continuar coincidiendo con MapaAccesos en el backend.
 */
export const TABS_BY_MODULO: Record<Modulo, TabDefinition[]> = Object.fromEntries(
    Object.values(Modulo).map((modulo) => [
        modulo,
        ACCESS_DOCUMENTATION_CATALOG[modulo].tabs.map((tab) => ({
            tabId: tab.tabId,
            label: tab.label,
            maxNivel: maxDocumentedLevel(tab),
        })),
    ]),
) as Record<Modulo, TabDefinition[]>;

export function tabsForModule(modulo: Modulo): TabDefinition[] {
    return TABS_BY_MODULO[modulo] ?? [];
}
