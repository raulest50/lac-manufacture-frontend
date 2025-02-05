// src/pdfGenerator.tsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrdenCompra } from "./types";


const detailsExotic = {
    razon_social: "Exotic Expert",
    direccion: "avenida 123",
    telefono: "1234",
    correo: "compras@exotic.com",
    nit: "1243",
    regimen_tributario: "simple",
}


// This class immediately generates and downloads the PDF when constructed.
export default class PdfGenerator {

    constructor(orden: OrdenCompra) {
        this.generatePDF(orden);
    }

    estado2Text(estado: number){
        if(estado == -1) return "Cancelada";
        if(estado == 0) return "Pendiente confirmacion proveedor";
        if(estado == 1) return "Pendiente recepcion y verificacion de precios negociadas";
        if(estado == 2) return "Pendiente recepcion y verificacion de cantidades negociadas";
        if(estado == 3) return "Cerrada exitosamente";
    }

    condicionPago2Text(condicion: string){
        if(condicion == "0") return "Credito";
        if(condicion == "1") return "Contado";
    }

    generatePDF(orden: OrdenCompra) {
        // Create a new jsPDF instance (portrait, A4 size)
        const doc = new jsPDF();

        // Set the title
        doc.setFontSize(18);
        doc.text("Orden de Compra", 14, 22);

        // Set font for details
        doc.setFontSize(12);
        const details = [
            { label: "Orden de Compra ID:", value: orden.ordenCompraId },
            { label: "Fecha Emisión:", value: orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleString() : "-" },
            { label: "Fecha Vencimiento:", value: orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString() : "-" },
            { label: "Proveedor:", value: orden.proveedor ? orden.proveedor.nombre : "-" },
            { label: "Condición de Pago:", value: this.condicionPago2Text(orden.condicionPago) },
            { label: "Tiempo de Entrega:", value: orden.tiempoEntrega },
            { label: "Plazo de Pago:", value: orden.plazoPago },
            { label: "Estado:", value: this.estado2Text(orden.estado) },
            { label: "Total a Pagar:", value: orden.totalPagar }
        ];

        let startY = 30;
        details.forEach(detail => {
            doc.text(`${detail.label} ${detail.value}`, 14, startY);
            startY += 7;
        });

        // Prepare data for the items table
        const items = orden.itemsOrdenCompra || [];
        const tableColumn = ["ID", "Materia Prima", "Cantidad", "Precio Unitario", "IVA", "Subtotal"];
        const tableRows = items.map(item => [
            item.itemOrdenId,
            item.materiaPrima ? `${item.materiaPrima.productoId} - ${item.materiaPrima.nombre}` : "-",
            item.cantidad,
            item.precioUnitario,
            item.iva19,
            item.subTotal
        ]);

        // Add the table to the PDF using autoTable
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startY + 5,
            styles: { fontSize: 10 }
        });

        // Add overall totals at the bottom (below the table)
        const finalY = (doc as any).lastAutoTable.finalY || startY + 5;
        doc.text(`Subtotal: ${orden.subTotal}`, 14, finalY + 10);
        doc.text(`IVA (19%): ${orden.iva19}`, 14, finalY + 17);
        doc.text(`Total a Pagar: ${orden.totalPagar}`, 14, finalY + 24);

        // Trigger the download of the PDF
        doc.save(`OrdenCompra_${orden.ordenCompraId}.pdf`);
    }
}
