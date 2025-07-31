import { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardHeader, Flex, IconButton, Text, Box, HStack, Heading, 
  FormControl, FormLabel, Input, Select, Divider, Grid, GridItem
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { 
  ActivoFijo, 
  ItemOrdenCompraActivo, 
  TIPO_INCORPORACION, 
  TipoActivo, 
  UnidadesCapacidad,
  DIVISAS
} from "../../../types.tsx";
import { MetodoDepreciacionComponent } from "../MetodoDepreciacion/MetodoDepreciacion.tsx";

type Props = {
    itemOrdenCompraActivo: ItemOrdenCompraActivo;
    setActivoFijoGroup: (activoFijoGroup: ActivoFijo[]) => void;
    tipoIncorporacion: string;
};

/**
 * cuando se hace una orden de compra de activos, es pósible que del mismo
 * activo se requiera varias unidades. sin embargo se debe registrar cada una
 * por separado a diferencia de como sucede con los materiales, ya que minimo
 * se debe establecer una identificacion, un lugar y un responsable para cada
 * activo a pesar que sea el mismo.
 * @param props
 * @constructor
 */
export function ActivoGroup({ itemOrdenCompraActivo, setActivoFijoGroup, tipoIncorporacion }: Props) {
    const [listaActivos, setListaActivos] = useState<ActivoFijo[]>([]);

    // Atributos comunes para todo el grupo
    const [tipoActivo, setTipoActivo] = useState<TipoActivo>(TipoActivo.EQUIPO); // Por defecto es EQUIPO
    const [brand, setBrand] = useState<string>("");

    // Estado para el precio unitario editable
    const [precioUnitario, setPrecioUnitario] = useState<number>(itemOrdenCompraActivo.precioUnitario);

    // Estado para el método de depreciación común para todo el grupo
    const [depreciacionGrupo, setDepreciacionGrupo] = useState<any>(null);

    // Función para calcular el subtotal basado en el precio unitario editado
    const calcularSubtotal = () => {
        return precioUnitario * itemOrdenCompraActivo.cantidad;
    };

    // Función para actualizar los atributos comunes en todos los activos
    const updateCommonAttributes = (newTipoActivo?: TipoActivo, newBrand?: string, newDepreciacion?: any) => {
        if (listaActivos.length > 0) {
            const updatedActivos = listaActivos.map(activo => ({
                ...activo,
                brand: newBrand !== undefined ? newBrand : brand,
                tipo: newTipoActivo !== undefined ? newTipoActivo : tipoActivo,
                ...(newDepreciacion || depreciacionGrupo ? {
                    valorAdquisicion: (newDepreciacion || depreciacionGrupo).vi,
                    valorResidual: (newDepreciacion || depreciacionGrupo).vf,
                    vidaUtilMeses: (newDepreciacion || depreciacionGrupo).Dt,
                    metodoDespreciacion: (newDepreciacion || depreciacionGrupo).metodo
                } : {})
            }));

            setListaActivos(updatedActivos);
            setActivoFijoGroup(updatedActivos);
        }
    };

    // No necesitamos un useEffect para actualizar los atributos comunes
    // Los handlers de onChange ya se encargan de actualizar los activos

    // Function to add a new activo
    const addActivo = () => {
        const newActivo: ActivoFijo = {
            id: `temp-${Date.now()}`, // Temporary ID until saved to backend
            nombre: itemOrdenCompraActivo.nombre,
            estado: 0, // Active state
            brand, // Aplicar el brand común
            tipo: tipoActivo, // Aplicar el tipo común
            // Usar el precio unitario editado en lugar del original
            precio: precioUnitario,
            // Aplicar la depreciación común si existe
            ...(depreciacionGrupo && {
                valorAdquisicion: depreciacionGrupo.vi,
                valorResidual: depreciacionGrupo.vf,
                vidaUtilMeses: depreciacionGrupo.Dt,
                metodoDespreciacion: depreciacionGrupo.metodo
            }),
            // Para activos de producción, inicializar campos específicos
            ...(tipoActivo === TipoActivo.PRODUCCION && {
                capacidad: 0,
                unidadCapacidad: UnidadesCapacidad.L
            })
        };

        const updatedList = [...listaActivos, newActivo];
        setListaActivos(updatedList);
        setActivoFijoGroup(updatedList);
    };

    // Function to remove an activo
    const removeActivo = () => {
        if (listaActivos.length === 0) return;

        const updatedList = listaActivos.slice(0, -1); // Remove the last item
        setListaActivos(updatedList);
        setActivoFijoGroup(updatedList);
    };

    // Function to update a specific activo
    const updateActivo = (index: number, field: string, value: any) => {
        const updatedActivos = [...listaActivos];
        updatedActivos[index] = {
            ...updatedActivos[index],
            [field]: value
        };
        setListaActivos(updatedActivos);
        setActivoFijoGroup(updatedActivos);
    };

    // Check if add button should be enabled
    const isAddEnabled = tipoIncorporacion === TIPO_INCORPORACION.SIN_OC || 
                         tipoIncorporacion === TIPO_INCORPORACION.AF_EXISTENTE;

    // Check if remove button should be enabled
    const isRemoveEnabled = (tipoIncorporacion === TIPO_INCORPORACION.SIN_OC ||
                             tipoIncorporacion === TIPO_INCORPORACION.AF_EXISTENTE) && 
                             listaActivos.length > 0;

    return (
        <Flex direction="column" width="100%">
            <Card boxShadow='lg' mb={4}>
                <CardHeader bg={"blue.200"} p={4}>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="md">{itemOrdenCompraActivo.nombre}</Heading>
                        <HStack spacing={2}>
                            <IconButton
                                aria-label="Add activo"
                                icon={<AddIcon />}
                                colorScheme="green"
                                size="sm"
                                isDisabled={!isAddEnabled}
                                onClick={addActivo}
                            />
                            <IconButton
                                aria-label="Remove activo"
                                icon={<MinusIcon />}
                                colorScheme="red"
                                size="sm"
                                isDisabled={!isRemoveEnabled}
                                onClick={removeActivo}
                            />
                        </HStack>
                    </Flex>
                </CardHeader>
                <CardBody p={4}>
                    <Box mb={4}>
                        <Text fontWeight="bold">Cantidad de activos: {listaActivos.length}</Text>
                        <Flex alignItems="center" mb={2}>
                            <Text mr={2}>Valor unitario Adquisicion: $</Text>
                            <Input 
                                type="number"
                                value={precioUnitario}
                                onChange={(e) => {
                                    const newPrecioUnitario = parseFloat(e.target.value);
                                    setPrecioUnitario(newPrecioUnitario);

                                    // Actualizar el precio de todos los activos que no han sido modificados individualmente
                                    if (listaActivos.length > 0) {
                                        const updatedActivos = listaActivos.map(activo => ({
                                            ...activo,
                                            precio: activo.precio === itemOrdenCompraActivo.precioUnitario || activo.precio === precioUnitario 
                                                ? newPrecioUnitario 
                                                : activo.precio
                                        }));
                                        setListaActivos(updatedActivos);
                                        setActivoFijoGroup(updatedActivos);
                                    }
                                }}
                                size="sm"
                                width="100px"
                            />
                        </Flex>
                    </Box>

                    {/* Atributos comunes para todo el grupo */}
                    <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" mb={4}>
                        <Text fontWeight="bold" mb={2}>Atributos comunes del grupo</Text>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Tipo de Activo</FormLabel>
                                    <Select 
                                        value={tipoActivo}
                                        onChange={(e) => {
                                            const newTipoActivo = e.target.value as TipoActivo;
                                            setTipoActivo(newTipoActivo);
                                            updateCommonAttributes(newTipoActivo, undefined, undefined);
                                        }}
                                    >
                                        <option value={TipoActivo.EQUIPO}>Equipos</option>
                                        <option value={TipoActivo.MOBILIARIO}>Mobiliario</option>
                                        <option value={TipoActivo.PRODUCCION}>Activo de Producción</option>
                                    </Select>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Marca</FormLabel>
                                    <Input 
                                        value={brand} 
                                        onChange={(e) => {
                                            const newBrand = e.target.value;
                                            setBrand(newBrand);
                                            updateCommonAttributes(undefined, newBrand, undefined);
                                        }}
                                        placeholder="Ej: Dell, Lenovo, Fluke..."
                                    />
                                </FormControl>
                            </GridItem>
                            {tipoActivo === TipoActivo.PRODUCCION && (
                                <>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>Capacidad</FormLabel>
                                            <Input 
                                                type="number"
                                                placeholder="Capacidad"
                                                value={0}
                                                onChange={(e) => {
                                                    const capacidad = parseFloat(e.target.value);
                                                    // Actualizar la capacidad en todos los activos
                                                    if (listaActivos.length > 0) {
                                                        const updatedActivos = listaActivos.map(activo => ({
                                                            ...activo,
                                                            capacidad
                                                        }));
                                                        setListaActivos(updatedActivos);
                                                        setActivoFijoGroup(updatedActivos);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>Unidad de Capacidad</FormLabel>
                                            <Select 
                                                value={UnidadesCapacidad.L}
                                                onChange={(e) => {
                                                    const unidadCapacidad = e.target.value as UnidadesCapacidad;
                                                    // Actualizar la unidad de capacidad en todos los activos
                                                    if (listaActivos.length > 0) {
                                                        const updatedActivos = listaActivos.map(activo => ({
                                                            ...activo,
                                                            unidadCapacidad
                                                        }));
                                                        setListaActivos(updatedActivos);
                                                        setActivoFijoGroup(updatedActivos);
                                                    }
                                                }}
                                            >
                                                <option value={UnidadesCapacidad.L}>Litros (L)</option>
                                                <option value={UnidadesCapacidad.KG}>Kilogramos (KG)</option>
                                                <option value={UnidadesCapacidad.TON}>Toneladas (TON)</option>
                                                <option value={UnidadesCapacidad.M3}>Metros cúbicos (M3)</option>
                                                <option value={UnidadesCapacidad.W}>Watts (W)</option>
                                                <option value={UnidadesCapacidad.HP}>Horse Power (HP)</option>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </>
                            )}
                        </Grid>
                    </Box>

                    {/* Lista de activos individuales */}
                    {listaActivos.map((activo, index) => (
                        <Box 
                            key={activo.id} 
                            p={3} 
                            mb={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                            bg="gray.50"
                        >
                            <Text fontWeight="bold">Activo #{index + 1}</Text>
                            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={2}>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>ID</FormLabel>
                                        <Input 
                                            value={activo.id} 
                                            onChange={(e) => updateActivo(index, 'id', e.target.value)}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Nombre</FormLabel>
                                        <Input 
                                            value={activo.nombre} 
                                            onChange={(e) => updateActivo(index, 'nombre', e.target.value)}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Precio</FormLabel>
                                        <Input 
                                            type="number"
                                            placeholder="Precio"
                                            value={activo.precio || precioUnitario}
                                            onChange={(e) => updateActivo(index, 'precio', parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                </GridItem>

                            </Grid>
                        </Box>
                    ))}

                    {listaActivos.length === 0 && (
                        <Box p={4} textAlign="center" color="gray.500">
                            No hay activos registrados. {isAddEnabled ? 'Haga clic en el botón + para agregar.' : ''}
                        </Box>
                    )}

                    <Divider my={4} />

                    {/* Método de depreciación común para todo el grupo */}
                    {listaActivos.length > 0 && (
                        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" mb={4}>
                            <Text fontWeight="bold" mb={2}>Método de Depreciación (común para todo el grupo)</Text>
                            <MetodoDepreciacionComponent 
                                setDepreciacion={(depreciacion) => {
                                    setDepreciacionGrupo(depreciacion);
                                    updateCommonAttributes(undefined, undefined, depreciacion);
                                }} 
                            />
                        </Box>
                    )}
                </CardBody>
            </Card>
        </Flex>
    );
}
