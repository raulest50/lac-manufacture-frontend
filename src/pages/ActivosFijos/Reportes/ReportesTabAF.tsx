import {useState} from 'react';
import {Flex} from '@chakra-ui/react';
import {OrdenCompraActivos} from "../../Compras/types.tsx";
import PdfGenerator from "../../Compras/pdfGenerator.tsx";

// type Props = {};

export function ReportesTabAf() {

    const generarPDF =
        async (orden:OrdenCompraActivos) => {

        const generator = new PdfGenerator();
        await generator.generatePDF_OCA(orden);
    }

    return (
        <Flex>

        </Flex>
    );
}
