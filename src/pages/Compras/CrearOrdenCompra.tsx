// CrearOrdenCompra.tsx

import {
    Container,
    Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { Proveedor } from "./types"; // Import the Proveedor type
import ProveedorPicker from "./ProveedorPicker";
import ProveedorCard from "./ProveedorCard";

export default function CrearOrdenCompra() {
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <Flex direction="column" p={0} m={0} w="full" h="full">
                <ProveedorCard
                    selectedProveedor={selectedProveedor}
                    onSearchClick={() => setIsProveedorPickerOpen(true)}
                />
            </Flex>

            {/* ProveedorPicker Modal */}
            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(proveedor) => setSelectedProveedor(proveedor)}
            />
        </Container>
    );
}
