import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { AccessLevelDocumentation } from "./accessDocumentationCatalog.ts";

const LEVEL_PALETTES: Record<number, "green" | "blue" | "purple" | "orange"> = {
    1: "green",
    2: "blue",
    3: "purple",
    4: "orange",
};

type Props = {
    niveles: readonly AccessLevelDocumentation[];
    selectedLevel?: number;
};

function BulletList({ items }: { items: readonly string[] }) {
    return (
        <Box as="ul" ps={5} color="app.textMuted">
            {items.map((item) => (
                <Text as="li" key={item} fontSize="sm" mb={1}>
                    {item}
                </Text>
            ))}
        </Box>
    );
}

export default function AccessLevelCards({ niveles, selectedLevel }: Props) {
    return (
        <VStack align="stretch" gap={3}>
            {niveles.map((item) => {
                const isSelected = item.nivel === selectedLevel;
                return (
                    <Box
                        key={item.nivel}
                        borderWidth="1px"
                        borderColor={isSelected ? "blue.400" : "app.border"}
                        borderRadius="md"
                        p={{ base: 3, md: 4 }}
                        bg={isSelected ? "app.rowActiveBlue" : "app.surfaceSubtle"}
                        aria-current={isSelected ? "true" : undefined}
                    >
                        <Flex align={{ base: "flex-start", sm: "center" }} gap={2} wrap="wrap" mb={2}>
                            <Badge colorPalette={LEVEL_PALETTES[item.nivel] ?? "gray"}>
                                Nivel {item.nivel}
                            </Badge>
                            <Text fontWeight="semibold">{item.titulo}</Text>
                            {isSelected && <Badge colorPalette="blue" variant="outline">Nivel seleccionado</Badge>}
                        </Flex>

                        {item.permite.length > 0 ? (
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" mb={1}>Permite</Text>
                                <BulletList items={item.permite} />
                            </Box>
                        ) : (
                            <Text fontSize="sm" color="app.textMuted">
                                Este nivel no habilita una operación visible en la implementación actual.
                            </Text>
                        )}

                        {item.noIncluye?.length ? (
                            <Box mt={3}>
                                <Text fontSize="sm" fontWeight="semibold" mb={1}>No incluye</Text>
                                <BulletList items={item.noIncluye} />
                            </Box>
                        ) : null}
                    </Box>
                );
            })}
        </VStack>
    );
}
