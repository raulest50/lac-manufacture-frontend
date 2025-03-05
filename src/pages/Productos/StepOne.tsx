// StepOneComponent.tsx
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OrdenCompra, ItemOrdenCompra } from "./types.tsx";

interface props {
    setActiveStep: (step: number) => void;
}

export default function StepOne({setActiveStep}: props) {
    // Local copy of the order's items to track verification state.


    return (
        <></>
    );
}
