import { useRef, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Modulo } from "../types.tsx";
import AccessHelpDialog, { type AccessHelpTarget } from "./AccessHelpDialog.tsx";

function DialogStory({ target, label }: { target: AccessHelpTarget; label: string }) {
    const [open, setOpen] = useState(true);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    return (
        <Box p={6} minH="100vh" bg="app.surface">
            <Text mb={4}>Historia aislada para revisar contenido, foco y comportamiento responsivo.</Text>
            <Button ref={triggerRef} onClick={() => setOpen(true)}>{label}</Button>
            <AccessHelpDialog
                open={open}
                target={target}
                onClose={() => setOpen(false)}
                finalFocusRef={triggerRef}
            />
        </Box>
    );
}

export const AyudaGeneral = () => (
    <DialogStory target={{ kind: "general" }} label="Abrir ayuda general" />
);

export const ModuloProduccion = () => (
    <DialogStory
        target={{ kind: "module", modulo: Modulo.PRODUCCION }}
        label="Abrir ayuda de Producción"
    />
);

export const TabCuatroNiveles = () => (
    <DialogStory
        target={{
            kind: "tab",
            modulo: Modulo.PRODUCCION,
            tabId: "CREAR_ODP_MANUALMENTE",
            selectedLevel: 3,
        }}
        label="Abrir ayuda de Nueva ODP"
    />
);

export const TabUnNivel = () => (
    <DialogStory
        target={{
            kind: "tab",
            modulo: Modulo.CALIDAD,
            tabId: "HISTORIAL_CONTROL_CALIDAD",
            selectedLevel: 1,
        }}
        label="Abrir ayuda de Historial de ensayos"
    />
);
