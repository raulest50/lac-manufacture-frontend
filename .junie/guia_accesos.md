# Guía de Accesos por Nivel en la Aplicación

Este documento describe la implementación y funcionamiento del sistema de restricciones por nivel de acceso en los diferentes módulos de la aplicación.

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Módulo de Productos](#módulo-de-productos)
3. [Módulo de Compras](#módulo-de-compras)
4. [Guía de Implementación](#guía-de-implementación)

## Introducción

El sistema de restricciones por nivel permite controlar el acceso a diferentes funcionalidades dentro de cada módulo de la aplicación según el nivel de acceso asignado al usuario. Los niveles de acceso son:

- **Nivel 1**: Acceso básico (solo consulta)
- **Nivel 2**: Acceso avanzado (consulta y creación/modificación)
- **Nivel 3**: Acceso completo (todas las funcionalidades)

El usuario 'master' tiene acceso completo a todas las funcionalidades independientemente de los niveles.

## Módulo de Productos

En el módulo de Productos, las restricciones por nivel están implementadas de la siguiente manera:

### Niveles de Acceso

- **Nivel 1**: Solo permite acceder a la pestaña de "Consulta" para visualizar productos existentes.
- **Nivel 2 o superior**: Permite acceder a todas las pestañas, incluyendo "Codificar Material" y "Crear Terminado/Semiterminado".

### Implementación

La implementación se encuentra en el archivo `src/pages/Productos/ProductosPage.tsx`. El componente obtiene el nivel de acceso del usuario mediante una llamada al endpoint `whoami` y luego renderiza condicionalmente las pestañas según el nivel de acceso:

```tsx
// Obtener el nivel de acceso
useEffect(() => {
    const fetchUserAccessLevel = async () => {
        try {
            const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
            const authorities = response.data.authorities;

            // Buscar la autoridad para el módulo PRODUCTOS
            const productosAuthority = authorities.find(
                auth => auth.authority === "ACCESO_PRODUCTOS"
            );

            // Si se encuentra, establecer el nivel de acceso
            if (productosAuthority) {
                setProductosAccessLevel(parseInt(productosAuthority.nivel));
            }
        } catch (error) {
            console.error("Error al obtener el nivel de acceso:", error);
        }
    };

    fetchUserAccessLevel();
}, []);

// Renderizado condicional de pestañas
<TabList>
    {/* Solo mostrar las pestañas de creación si el usuario es master o tiene nivel 2 o superior */}
    {(user === 'master' || productosAccessLevel >= 2) && (
        <Tab sx={my_style_tab}>Codificar Material</Tab>
    )}
    <Tab sx={my_style_tab}>Consulta</Tab>
    {(user === 'master' || productosAccessLevel >= 2) && (
        <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
    )}
</TabList>
```

## Módulo de Compras

En el módulo de Compras, las restricciones por nivel están implementadas de manera similar:

### Niveles de Acceso

- **Nivel 1**: Permite visualizar órdenes de compra pero con funcionalidades limitadas.
- **Nivel 2 o superior**: Permite acceder a todas las funcionalidades, incluyendo la actualización del estado de las órdenes de compra.

### Implementación

La implementación se encuentra en el archivo `src/pages/Compras/components/ListaOrdenesCompra.tsx`. El componente obtiene el nivel de acceso del usuario y muestra u oculta opciones según el nivel:

```tsx
// Solo mostrar la opción de actualizar estado si el usuario es master o tiene nivel de acceso 2 o superior
{(user === 'master' || comprasAccessLevel >= 2) && (
    <Box
        p={1}
        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
        onClick={handleActualizarOrden}
    >
        Actualizar Estado de la Orden
    </Box>
)}
```

## Guía de Implementación

Para implementar restricciones por nivel en un nuevo módulo, sigue estos pasos:

1. **Definir los niveles de acceso** para el módulo:
   - Nivel 1: Generalmente para consulta
   - Nivel 2: Para creación/modificación
   - Nivel 3: Para operaciones avanzadas o críticas

2. **Obtener el nivel de acceso del usuario**:
   ```tsx
   const [moduleAccessLevel, setModuleAccessLevel] = useState<number>(0);
   const { user } = useAuth();
   
   useEffect(() => {
       const fetchUserAccessLevel = async () => {
           try {
               const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
               const authorities = response.data.authorities;
               
               const moduleAuthority = authorities.find(
                   auth => auth.authority === "ACCESO_MODULO"
               );
               
               if (moduleAuthority) {
                   setModuleAccessLevel(parseInt(moduleAuthority.nivel));
               }
           } catch (error) {
               console.error("Error al obtener el nivel de acceso:", error);
           }
       };
       
       fetchUserAccessLevel();
   }, []);
   ```

3. **Renderizar condicionalmente** los componentes según el nivel de acceso:
   ```tsx
   {(user === 'master' || moduleAccessLevel >= requiredLevel) && (
       <ComponenteRestringido />
   )}
   ```

4. **Asegurar la seguridad en el backend**: Recuerda que las restricciones en el frontend son solo para la interfaz de usuario. Es crucial implementar también las restricciones correspondientes en el backend para garantizar la seguridad.

5. **Manejar errores y casos límite**: Considera qué debe ocurrir cuando un usuario no tiene acceso o cuando hay errores al obtener el nivel de acceso.

Siguiendo estas pautas, se puede mantener un sistema de acceso por niveles coherente en toda la aplicación.