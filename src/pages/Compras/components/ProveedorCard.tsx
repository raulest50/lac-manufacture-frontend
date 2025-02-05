// ProveedorCard.tsx

import React from "react";
import {
    Card,
    CardHeader,
    HStack,
    IconButton,
    Heading,
    Divider,
    CardBody,
    VStack,
    Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { Proveedor } from "../types.tsx"; // Adjust path if needed

interface ProveedorCardProps {
    selectedProveedor: Proveedor | null;
    onSearchClick: () => void;
}

const ProveedorCard: React.FC<ProveedorCardProps> = ({
                                                         selectedProveedor,
                                                         onSearchClick,
                                                     }) => {
    return (
        <Card>
            <CardHeader>
                <HStack>
                    <IconButton
                        aria-label="Buscar Proveedor"
                        icon={<FaSearch />}
                        onClick={onSearchClick}
                    />
                    <Heading size="sm">
                        {selectedProveedor
                            ? selectedProveedor.nombre
                            : "Click para seleccionar un proveedor"}
                    </Heading>
                </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
                <HStack>
                    <VStack alignItems="start">
                        <Text pt="2" fontSize="sm">
                            Nit: {selectedProveedor ? selectedProveedor.id : ""}
                        </Text>
                        <Text pt="2" fontSize="sm">
                            Tel: {selectedProveedor ? selectedProveedor.telefono : ""}
                        </Text>
                        <Text pt="2" fontSize="sm">
                            Ciudad: {selectedProveedor ? selectedProveedor.ciudad : ""}
                        </Text>
                    </VStack>

                    <VStack alignItems="start">
                        <Text pt="2" fontSize="sm">
                            RegimenTributario: {selectedProveedor ? selectedProveedor.regimenTributario : ""}
                        </Text>
                    </VStack>

                </HStack>
            </CardBody>
        </Card>
    );
};

export default ProveedorCard;
