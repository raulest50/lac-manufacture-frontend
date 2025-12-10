import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Card,
    CardBody,
    Heading,
    Stack,
    StackDivider,
    Text,
} from '@chakra-ui/react';
import type {Insumo} from '../../types.tsx';

type Props = {
    insumos?: Insumo[] | null;
    nivel?: number;
    titulo?: string;
};

type ProductoConInsumos = Insumo['producto'] & { insumos?: Insumo[] };

const formatCantidad = (cantidad?: number) => {
    if (typeof cantidad !== 'number' || Number.isNaN(cantidad)) {
        return '0';
    }
    return cantidad.toLocaleString('es-CO', { maximumFractionDigits: 2 });
};

const tipoBadge = (tipo?: string) => {
    switch (tipo) {
    case 'M':
        return { label: 'Material', colorScheme: 'blue' as const };
    case 'S':
        return { label: 'Semiterminado', colorScheme: 'orange' as const };
    case 'T':
        return { label: 'Terminado', colorScheme: 'green' as const };
    default:
        return { label: 'Producto', colorScheme: 'gray' as const };
    }
};

function InsumoCard({ insumo, nivelActual }: { insumo: Insumo; nivelActual: number }) {
    const producto = insumo.producto as ProductoConInsumos;
    const badge = tipoBadge(producto?.tipo_producto);
    const subInsumos = (insumo as unknown as { insumos?: Insumo[] }).insumos ?? producto?.insumos;
    const hasSubInsumos = Array.isArray(subInsumos) && subInsumos.length > 0;
    const isMaterial = producto?.tipo_producto === 'M';

    return (
        <Card variant="outline" shadow="sm" ml={nivelActual * 4} borderColor="gray.200">
            <CardBody>
                <Stack spacing={3}>
                    <Stack direction="row" justify="space-between" align="center">
                        <Box>
                            <Heading size="sm">{producto?.nombre ?? 'Producto sin nombre'}</Heading>
                            <Text fontSize="sm" color="gray.600">ID: {producto?.productoId ?? 'N/D'}</Text>
                        </Box>
                        <Badge colorScheme={badge.colorScheme}>{badge.label}</Badge>
                    </Stack>

                    <Text fontWeight="medium">
                        Cantidad requerida:{' '}
                        <Text as="span" fontWeight="semibold">
                            {formatCantidad(insumo.cantidadRequerida)} {producto?.tipoUnidades ?? ''}
                        </Text>
                    </Text>

                    {hasSubInsumos && !isMaterial && (
                        <Accordion allowToggle>
                            <AccordionItem border="none">
                                <h2>
                                    <AccordionButton px={0}>
                                        <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                                            Ver insumos
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={2} pl={2}>
                                    <InsumoListCard insumos={subInsumos} nivel={nivelActual + 1} />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    )}

                    {!hasSubInsumos && !isMaterial && (
                        <Text fontSize="sm" color="gray.500">
                            Sin insumos definidos para este producto.
                        </Text>
                    )}
                </Stack>
            </CardBody>
        </Card>
    );
}

export default function InsumoListCard({ insumos, nivel = 0, titulo }: Props) {
    const lista = Array.isArray(insumos) ? insumos : [];

    return (
        <Box>
            {titulo && (
                <Heading size="md" mb={4} pl={nivel * 4}>
                    {titulo}
                </Heading>
            )}

            {!lista.length ? (
                <Text color="gray.500" pl={nivel * 4}>
                    Sin insumos para mostrar.
                </Text>
            ) : (
                <Stack spacing={3} divider={<StackDivider borderColor="gray.100" />}>
                    {lista.map((insumo, index) => (
                        <InsumoCard key={`${insumo.producto?.productoId ?? index}-${index}`} insumo={insumo} nivelActual={nivel} />
                    ))}
                </Stack>
            )}
        </Box>
    );
}
