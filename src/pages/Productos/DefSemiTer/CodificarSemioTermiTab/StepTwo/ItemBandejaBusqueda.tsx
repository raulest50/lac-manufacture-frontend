import React from "react";
import {
    Box,
    Text,
    Flex,
    HStack,
    VStack,
    Tag,
    Icon,
    IconButton,
    Tooltip,
    Badge,
    useColorModeValue,
} from "@chakra-ui/react";
import { Producto } from "../../../types.tsx";

// Icons
import { FiPlus } from "react-icons/fi";

// Shared helpers
import { metaPorTipo } from "./meta";

interface ItemBandejaBusquedaProps {
    producto: Producto;
    onAddInsumo: (producto: Producto) => void;
}

const ItemBandejaBusqueda: React.FC<ItemBandejaBusquedaProps> = ({
                                                                     producto,
                                                                     onAddInsumo,
                                                                 }) => {
    const meta = metaPorTipo(producto.tipo_producto);
    const cardBg  = useColorModeValue("white", "gray.800");
    const muted   = useColorModeValue("gray.600", "gray.300");
    const borderC = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

    const costoFmt =
        typeof producto.costo === "number"
            ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(producto.costo)
            : producto.costo;

    return (
        <Box
            key={producto.productoId}
            w="full"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderC}
            borderRadius="xl"
            boxShadow="sm"
            overflow="hidden"
            position="relative"
            role="group"
            transition="all 0.18s ease"
            _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        >
            {/* Acento vertical */}
            <Box position="absolute" left={0} top={0} bottom={0} w="6px" bg={meta.accentColor} />

            <Flex align="center" gap={4} px={4} py={3}>
                {/* Icono por tipo */}
                <Box
                    bg={meta.accentColor}
                    borderWidth="1px"
                    borderColor={meta.accentColor}
                    color="white"
                    rounded="lg"
                    p={2.5}
                    minW="42px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _groupHover={{ bg: meta.accentColor }}
                >
                    <Icon as={meta.icon} boxSize={5} />
                </Box>

                {/* Texto */}
                <VStack align="start" spacing={0} flex="1" minW={0}>
                    <HStack spacing={2} w="100%">
                        <Text fontWeight="semibold" noOfLines={1} fontSize="md">
                            {producto.nombre}
                        </Text>
                        <Tag size="sm" colorScheme={meta.scheme} variant="subtle">
                            {meta.label}
                        </Tag>
                    </HStack>

                    <HStack spacing={3} mt={1} flexWrap="wrap">
                        <Badge variant="subtle" colorScheme="gray">ID: {producto.productoId}</Badge>
                        <Text fontSize="sm" color={muted}>{costoFmt}</Text>
                        <Text fontSize="sm" color={muted}>
                            {producto.tipoUnidades} · {producto.cantidadUnidad}
                        </Text>
                    </HStack>
                </VStack>

                {/* Acción agregar */}
                <Tooltip label="Agregar" hasArrow>
                    <IconButton
                        aria-label="Agregar"
                        icon={<FiPlus />}
                        colorScheme={meta.scheme}
                        variant="solid"
                        size="sm"
                        borderRadius="full"
                        onClick={() => onAddInsumo(producto)}
                        _active={{ transform: "scale(0.96)" }}
                    />
                </Tooltip>
            </Flex>
        </Box>
    );
};

export default ItemBandejaBusqueda;
