import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { Proveedor } from '../types';

type Props = {
    proveedores: Proveedor[];
};

export function ListaSearchProveedores({ proveedores }: Props) {
    if (proveedores.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Text>No se encontraron proveedores con los criterios de búsqueda.</Text>
            </Box>
        );
    }

    return (
        <Box overflowX="auto" width="100%">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Nombre</Th>
                        <Th>Ciudad</Th>
                        <Th>Departamento</Th>
                        <Th>Categorías</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {proveedores.map((proveedor) => (
                        <Tr key={proveedor.id}>
                            <Td>{proveedor.id}</Td>
                            <Td>{proveedor.nombre}</Td>
                            <Td>{proveedor.ciudad || '-'}</Td>
                            <Td>{proveedor.departamento || '-'}</Td>
                            <Td>{getCategoriesText(proveedor.categorias)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}

function getCategoriesText(categories: number[]): string {
    const categoryNames = [
        'Servicios Operativos',
        'Materias Primas',
        'Materiales de empaque',
        'Servicios administrativos',
        'Equipos y otros servicios'
    ];

    return categories.map(catId => categoryNames[catId]).join(', ');
}
