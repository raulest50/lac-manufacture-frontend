import React from "react";
import { BiTestTube } from "react-icons/bi";
import { FiLayers, FiPackage } from "react-icons/fi";

export type MetaTipo = {
    label: string;
    scheme: "teal" | "purple" | "orange" | "gray" | "green";
    icon: React.ElementType;
    accentColor: string;
};

export const metaPorTipo = (tipo: string): MetaTipo => {
    switch (tipo) {
        case "M":
            return { label: "Materia prima", scheme: "green", icon: BiTestTube, accentColor: "green.300" };
        case "S":
            return { label: "Semiterminado", scheme: "purple", icon: FiLayers, accentColor: "purple.300" };
        case "T":
            return { label: "Terminado", scheme: "orange", icon: FiPackage, accentColor: "orange.300" };
        default:
            return { label: "Producto", scheme: "gray", icon: FiPackage, accentColor: "gray.300" };
    }
};
