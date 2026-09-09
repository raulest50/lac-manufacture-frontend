import { useMemo, useState } from "react";
import {
    Accordion,
    Alert,
    Badge,
    Box,
    Flex,
    Heading,
    Icon,
    Input,
    InputGroup,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import AccessLevelCards from "./GestionUsuarios/access-help/AccessLevelCards.tsx";
import {
    ACCESS_DOCUMENTATION_MODULES,
    maxDocumentedLevel,
    type AccessModuleDocumentation,
} from "./GestionUsuarios/access-help/accessDocumentationCatalog.ts";

function normalize(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function tabSearchText(moduleDocumentation: AccessModuleDocumentation, tabIndex: number): string {
    const tab = moduleDocumentation.tabs[tabIndex];
    return normalize([
        tab.tabId,
        tab.label,
        tab.resumen,
        ...(tab.condiciones ?? []),
        ...(tab.observaciones ?? []),
        ...tab.niveles.flatMap((item) => [
            `nivel ${item.nivel}`,
            item.titulo,
            ...item.permite,
            ...(item.noIncluye ?? []),
        ]),
    ].join(" "));
}

function DocumentationList({ title, items }: { title: string; items?: readonly string[] }) {
    if (!items?.length) return null;
    return (
        <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={1}>{title}</Text>
            <Box as="ul" ps={5} color="app.textMuted">
                {items.map((item) => <Text as="li" key={item} fontSize="sm" mb={1}>{item}</Text>)}
            </Box>
        </Box>
    );
}

export default function InfoNiveles() {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredModules = useMemo(() => {
        const query = normalize(searchTerm.trim());
        if (!query) return ACCESS_DOCUMENTATION_MODULES;

        return ACCESS_DOCUMENTATION_MODULES.flatMap((moduleDocumentation) => {
            const moduleMatches = normalize([
                moduleDocumentation.modulo,
                moduleDocumentation.label,
                moduleDocumentation.resumen,
                ...(moduleDocumentation.condiciones ?? []),
            ].join(" ")).includes(query);

            const matchingTabs = moduleMatches
                ? moduleDocumentation.tabs
                : moduleDocumentation.tabs.filter((_, index) => tabSearchText(moduleDocumentation, index).includes(query));

            return matchingTabs.length > 0
                ? [{ ...moduleDocumentation, tabs: matchingTabs }]
                : [];
        });
    }, [searchTerm]);

    return (
        <Box p={4}>
            <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} gap={3} wrap="wrap" mb={4}>
                <Box>
                    <Heading size="md">Documentación de niveles de acceso</Heading>
                    <Text fontSize="sm" color="app.textMuted" mt={1}>
                        Consulta el alcance actual de cada módulo, pestaña y nivel configurable.
                    </Text>
                </Box>
                <Badge colorPalette="blue" borderRadius="full" px={3} py={1}>
                    {ACCESS_DOCUMENTATION_MODULES.length} módulos
                </Badge>
            </Flex>

            <Alert.Root status="info" mb={4} variant="subtle" borderRadius="md">
                <Alert.Indicator alignSelf="flex-start" mt={1} />
                <Box>
                    <Alert.Title>Cada pestaña tiene su propia escala</Alert.Title>
                    <Alert.Description>
                        No existe una definición general para los niveles 1, 2, 3 o 4. Revisa la pestaña concreta:
                        un nivel superior solo añade privilegios cuando su descripción lo indica expresamente.
                    </Alert.Description>
                </Box>
            </Alert.Root>

            <InputGroup
                mb={6}
                startElement={<Icon as={LuSearch} color="app.textSubtle" />}
                startElementProps={{ pointerEvents: "none" }}
            >
                <Input
                    aria-label="Buscar en la documentación de accesos"
                    placeholder="Buscar módulo, pestaña, operación, condición o nivel..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    variant="subtle"
                    _hover={{ bg: "app.rowHoverStrong" }}
                    _focus={{ bg: "app.surface", borderColor: "blue.500" }}
                />
            </InputGroup>

            {filteredModules.length === 0 ? (
                <Alert.Root status="info">
                    <Alert.Indicator />
                    No se encontraron módulos o pestañas que coincidan con la búsqueda.
                </Alert.Root>
            ) : (
                <Accordion.Root multiple>
                    {filteredModules.map((moduleDocumentation) => (
                        <Accordion.Item
                            key={moduleDocumentation.modulo}
                            value={moduleDocumentation.modulo}
                            mb={3}
                            borderWidth="1px"
                            borderRadius="md"
                            overflow="hidden"
                        >
                            <h2>
                                <Accordion.ItemTrigger px={4} py={3} _expanded={{ bg: "app.rowActiveBlue" }}>
                                    <Box flex="1" textAlign="left">
                                        <Flex align="center" gap={2} wrap="wrap">
                                            <Text fontWeight="bold">{moduleDocumentation.label}</Text>
                                            <Badge colorPalette="gray">
                                                {moduleDocumentation.tabs.length} {moduleDocumentation.tabs.length === 1 ? "pestaña" : "pestañas"}
                                            </Badge>
                                        </Flex>
                                        <Text fontSize="sm" color="app.textMuted" mt={1}>
                                            {moduleDocumentation.resumen}
                                        </Text>
                                    </Box>
                                    <Accordion.ItemIndicator />
                                </Accordion.ItemTrigger>
                            </h2>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody p={{ base: 3, md: 4 }}>
                                    <VStack align="stretch" gap={5}>
                                        <DocumentationList title="Reglas comunes del módulo" items={moduleDocumentation.condiciones} />

                                        {moduleDocumentation.tabs.map((tabDocumentation) => (
                                            <Box
                                                key={tabDocumentation.tabId}
                                                borderWidth="1px"
                                                borderRadius="lg"
                                                p={{ base: 3, md: 4 }}
                                                bg="app.surface"
                                            >
                                                <Flex
                                                    justify="space-between"
                                                    align={{ base: "flex-start", sm: "center" }}
                                                    direction={{ base: "column", sm: "row" }}
                                                    gap={2}
                                                    mb={2}
                                                >
                                                    <Box>
                                                        <Heading as="h3" size="sm">{tabDocumentation.label}</Heading>
                                                        <Text fontSize="xs" color="app.textSubtle">{tabDocumentation.tabId}</Text>
                                                    </Box>
                                                    <Badge colorPalette="blue">
                                                        {tabDocumentation.niveles.length === 1
                                                            ? `Nivel ${tabDocumentation.niveles[0].nivel}`
                                                            : `Niveles 1–${maxDocumentedLevel(tabDocumentation)}`}
                                                    </Badge>
                                                </Flex>
                                                <Text color="app.textMuted" mb={4}>{tabDocumentation.resumen}</Text>
                                                <VStack align="stretch" gap={3} mb={4}>
                                                    <DocumentationList title="Condiciones" items={tabDocumentation.condiciones} />
                                                    <DocumentationList title="Observaciones" items={tabDocumentation.observaciones} />
                                                </VStack>
                                                <AccessLevelCards niveles={tabDocumentation.niveles} />
                                            </Box>
                                        ))}
                                    </VStack>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            )}
        </Box>
    );
}
