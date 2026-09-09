import type { RefObject } from "react";
import {
    Badge,
    Box,
    CloseButton,
    Dialog,
    Flex,
    Portal,
    Separator,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Modulo } from "../types.tsx";
import AccessLevelCards from "./AccessLevelCards.tsx";
import {
    getAccessModuleDocumentation,
    getAccessTabDocumentation,
    maxDocumentedLevel,
} from "./accessDocumentationCatalog.ts";

export type AccessHelpTarget =
    | { kind: "general" }
    | { kind: "module"; modulo: Modulo }
    | { kind: "tab"; modulo: Modulo; tabId: string; selectedLevel?: number };

type Props = {
    open: boolean;
    target: AccessHelpTarget | null;
    onClose: () => void;
    finalFocusRef?: RefObject<HTMLButtonElement | null>;
};

function Conditions({ items }: { items?: readonly string[] }) {
    if (!items?.length) return null;
    return (
        <Box borderWidth="1px" borderRadius="md" p={3} bg="app.surfaceSubtle">
            <Text fontWeight="semibold" mb={1}>Condiciones y alcance</Text>
            <Box as="ul" ps={5} color="app.textMuted">
                {items.map((item) => <Text as="li" key={item} fontSize="sm" mb={1}>{item}</Text>)}
            </Box>
        </Box>
    );
}

function GeneralHelp() {
    return (
        <VStack align="stretch" gap={4}>
            <Text>
                Los niveles no tienen una definición universal. Cada pestaña indica qué niveles admite y qué
                operaciones habilita cada uno en la implementación actual.
            </Text>
            <Box borderWidth="1px" borderRadius="md" p={4} bg="app.surfaceSubtle">
                <Text fontWeight="semibold">Cómo asignar un acceso</Text>
                <Box as="ol" ps={5} mt={2} color="app.textMuted">
                    <Text as="li" mb={1}>Activa el módulo y despliega sus pestañas.</Text>
                    <Text as="li" mb={1}>Activa únicamente las pestañas que necesita el usuario.</Text>
                    <Text as="li" mb={1}>Consulta la ayuda de la pestaña y selecciona el nivel adecuado.</Text>
                    <Text as="li">Revisa el resumen final antes de guardar.</Text>
                </Box>
            </Box>
            <Conditions items={[
                "Un nivel superior solo añade capacidades cuando la ayuda de esa pestaña lo indica expresamente.",
                "Algunas pantallas usan el nivel máximo del módulo y otras exigen el permiso exacto de la pestaña.",
                "Ciertas operaciones también dependen de directivas, estados del proceso o identidades especiales.",
                "La ayuda describe el comportamiento actual; no modifica los permisos ni las reglas de autorización.",
            ]} />
        </VStack>
    );
}

function ModuleHelp({ modulo }: { modulo: Modulo }) {
    const documentation = getAccessModuleDocumentation(modulo);
    return (
        <VStack align="stretch" gap={4}>
            <Text>{documentation.resumen}</Text>
            <Conditions items={documentation.condiciones} />
            <Separator />
            <Box>
                <Text fontWeight="semibold" mb={3}>Pestañas configurables</Text>
                <VStack align="stretch" gap={2}>
                    {documentation.tabs.map((item) => (
                        <Flex
                            key={item.tabId}
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                            gap={3}
                            justify="space-between"
                            align={{ base: "flex-start", sm: "center" }}
                            direction={{ base: "column", sm: "row" }}
                        >
                            <Box>
                                <Text fontWeight="semibold">{item.label}</Text>
                                <Text fontSize="sm" color="app.textMuted">{item.resumen}</Text>
                            </Box>
                            <Badge colorPalette="blue" flexShrink={0}>
                                {item.niveles.length === 1
                                    ? `Nivel ${item.niveles[0].nivel}`
                                    : `Niveles 1–${maxDocumentedLevel(item)}`}
                            </Badge>
                        </Flex>
                    ))}
                </VStack>
            </Box>
            <Text fontSize="sm" color="app.textMuted">
                Usa el icono de ayuda de una pestaña para consultar las operaciones de cada nivel.
            </Text>
        </VStack>
    );
}

function TabHelp({ modulo, tabId, selectedLevel }: Extract<AccessHelpTarget, { kind: "tab" }>) {
    const documentation = getAccessTabDocumentation(modulo, tabId);
    if (!documentation) {
        return <Text>No hay documentación disponible para esta pestaña.</Text>;
    }
    return (
        <VStack align="stretch" gap={4}>
            <Text>{documentation.resumen}</Text>
            <Conditions items={documentation.condiciones} />
            <AccessLevelCards niveles={documentation.niveles} selectedLevel={selectedLevel} />
            <Conditions items={documentation.observaciones} />
        </VStack>
    );
}

function dialogTitle(target: AccessHelpTarget | null): string {
    if (!target || target.kind === "general") return "Cómo funcionan los niveles de acceso";
    const moduleDocumentation = getAccessModuleDocumentation(target.modulo);
    if (target.kind === "module") return moduleDocumentation.label;
    return getAccessTabDocumentation(target.modulo, target.tabId)?.label ?? target.tabId;
}

export default function AccessHelpDialog({ open, target, onClose, finalFocusRef }: Props) {
    return (
        <Dialog.Root
            open={open}
            size={{ base: "full", md: "lg" }}
            placement="center"
            scrollBehavior="inside"
            finalFocusEl={finalFocusRef ? () => finalFocusRef.current : undefined}
            onOpenChange={({ open: nextOpen }) => {
                if (!nextOpen) onClose();
            }}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW={{ md: "3xl" }}>
                        <Dialog.Header>
                            <Dialog.Title>{dialogTitle(target)}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton aria-label="Cerrar ayuda de accesos" size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body pb={6}>
                            {!target || target.kind === "general" ? <GeneralHelp /> : null}
                            {target?.kind === "module" ? <ModuleHelp modulo={target.modulo} /> : null}
                            {target?.kind === "tab" ? <TabHelp {...target} /> : null}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
