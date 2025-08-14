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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useColorModeValue,
} from "@chakra-ui/react";
import { Insumo } from "../../../types.tsx";

// Icons
import { BiTestTube } from "react-icons/bi";            // Materia Prima
import { FiLayers, FiPackage, FiMinus } from "react-icons/fi"; // Semi / Terminado / Remove

interface ItemBandejaSeleccionProps {
    insumo: Insumo;
    onUpdateCantidad: (productoId: string, newCantidad: number) => void;
    onRemoveInsumo: (productoId: string) => void;
}

type MetaTipo = {
    label: string;
    scheme: "teal" | "purple" | "orange" | "gray";
    icon: React.ElementType;
};

const metaPorTipo = (tipo: string): MetaTipo => {
    switch (tipo) {
        case "M": return { label: "Materia prima", scheme: "teal",   icon: BiTestTube };
        case "S": return { label: "Semiterminado", scheme: "purple", icon: FiLayers };
        case "T": return { label: "Terminado",     scheme: "orange", icon: FiPackage };
        default:  return { label: "Producto",      scheme: "gray",   icon: FiPackage };
    }
};

const ItemBandejaSeleccion: React.FC<ItemBandejaSeleccionProps> = ({
                                                                       insumo,
                                                                       onUpdateCantidad,
                                                                       onRemoveInsumo,
                                                                   }) => {
    const { producto } = insumo;
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
            <Box position="absolute" left={0} top={0} bottom={0} w="6px" bg={`${meta.scheme}.400`} />

            <Flex align="center" gap={4} px={4} py={3}>
                {/* Icono por tipo */}
                <Box
                    bg={`${meta.scheme}.50`}
                    borderWidth="1px"
                    borderColor={`${meta.scheme}.200`}
                    color={`${meta.scheme}.600`}
                    rounded="lg"
                    p={2.5}
                    minW="42px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _groupHover={{ bg: `${meta.scheme}.100` }}
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

                {/* Cantidad */}
                <HStack align="center" spacing={2}>
                    <Tooltip label="Cantidad requerida" hasArrow>
                        <NumberInput
                            size="sm"
                            min={0}
                            value={insumo.cantidadRequerida}
                            onChange={(_vStr, vNum) =>
                                // Nota: el tipo de productoId en props es string, que coincide con la definición en Producto.
                                onUpdateCantidad(
                                    producto.productoId,
                                    Number.isFinite(vNum) ? vNum : 0
                                )
                            }
                            w="88px"
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Tooltip>

                    {/* Quitar */}
                    <Tooltip label="Remover" hasArrow>
                        <IconButton
                            aria-label="Remover"
                            icon={<FiMinus />}
                            colorScheme="red"
                            variant="solid"
                            size="sm"
                            borderRadius="full"
                            onClick={() =>
                                onRemoveInsumo(producto.productoId)
                            }
                            _active={{ transform: "scale(0.96)" }}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
        </Box>
    );
};

export default ItemBandejaSeleccion;
