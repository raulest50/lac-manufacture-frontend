// pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    getCondicionPagoText,
    getRegimenTributario,
    OrdenCompra,
    ItemOrdenCompra,
} from "./types";

// Extend jsPDF with properties added by jsPDF-AutoTable
interface AutoTableProperties {
    finalY: number;
}

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: AutoTableProperties;
}

export default class PdfGenerator {
    /**
     * Generates the PDF file for the given OrdenCompra and triggers its download.
     * @param orden the order data to populate the PDF with.
     */
    public async generatePDF(orden: OrdenCompra): Promise<void> {
        // Create a new jsPDF instance (A4 size, mm units) and cast to our extended interface
        const doc = new jsPDF({ unit: "mm", format: "a4" }) as jsPDFWithAutoTable;
        const margin = 10;
        let currentY = margin;

        // --- Logo Section ---
        // Fetch logo image as base64 and add it at top-left (simulating merged cells A1:B7)
        let logoBase64: string | null = null;
        try {
            logoBase64 = await this.getImageBase64("/logo_exotic.png");
        } catch (error) {
            console.error("Error fetching logo image", error);
        }
        if (logoBase64) {
            // Adjust the width and height as needed (here: 50mm x 40mm)
            doc.addImage(logoBase64, "PNG", margin, currentY, 50, 40);
        }

        // --- Header Title ---
        // Place "ORDEN DE COMPRA" in a prominent position (simulating merged cells E1:I3)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        // Center the title at the top of the page (adjust x and y as needed)
        doc.text("ORDEN DE COMPRA", 115, currentY + 20, { align: "center" });

        // --- Napolitana Company Info ---
        // (Simulating Excel cells A8:A11)
        currentY += 45 + 5; // move below the logo
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Napolitana J.P S.A.S.", margin, currentY);
        currentY += 7;
        doc.text("Nit: 901751897-1", margin, currentY);
        currentY += 7;
        doc.text("Tel: 301 711 51 81", margin, currentY);
        currentY += 7;
        doc.text("jorgerafaelpereiraosorio1@gmail.com", margin, currentY);

        // --- Order Details ---
        // (Simulating details in cells F4:I6)
        const detailX = 90; // starting x for details on the right side
        let detailY = margin + 10 + 30; // starting y (adjust as needed)
        doc.setFontSize(11);
        doc.text("FECHA EMISION ORDEN DE COMPRA:", detailX, detailY);
        doc.text(
            orden.fechaEmision ? orden.fechaEmision.toString().split("T")[0] : "",
            detailX + 80,
            detailY
        );
        detailY += 7;
        doc.text("NUMERO DE ORDEN DE COMPRA:", detailX, detailY);
        doc.text(
            orden.ordenCompraId ? orden.ordenCompraId.toString() : "",
            detailX + 80,
            detailY
        );
        detailY += 7;
        doc.text("FECHA DE VENCIMIENTO DE LA ORDEN:", detailX, detailY);
        doc.text(
            orden.fechaVencimiento ? orden.fechaVencimiento.toString().split("T")[0] : "",
            detailX + 80,
            detailY
        );

        // --- Lugar de Entrega y Condiciones de Pago ---
        // (Simulating merged cells F13:I21)
        let entregaY = detailY + 10;
        doc.setFont("helvetica", "bold");
        doc.text("LUGAR DE ENTREGA Y CONDICIONES DE PAGO", detailX, entregaY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        entregaY += 7;
        doc.text("Empresa: Napolitana JP S.A.S - EXOTIC EXPERT", detailX, entregaY);
        entregaY += 7;
        doc.text("Direccion: vía 11, Juan Mina #4 100", detailX, entregaY);
        entregaY += 7;
        doc.text("Barranquilla, Atlántico", detailX, entregaY);
        entregaY += 7;
        doc.text("[TELEFONO PLANTA EXOTIC]", detailX, entregaY);
        entregaY += 7;
        doc.text(getCondicionPagoText(orden.condicionPago) ?? "", detailX, entregaY);
        entregaY += 7;
        doc.text(`PLAZO PAGO ${orden.plazoPago} DIAS`, detailX, entregaY);
        entregaY += 7;
        doc.text(`PLAZO ENTREGA ${orden.tiempoEntrega} DIAS`, detailX, entregaY);
        entregaY += 7;
        doc.text("CONDICION ENTREGA: PUESTA EN PLANTA", detailX, entregaY);

        // --- Proveedor Information ---
        // (Simulating merged cells A13:B21)
        let proveedorY = currentY + 20; // start a bit lower than the Napolitana info
        doc.setFont("helvetica", "bold");
        doc.text("PROVEEDOR", margin, proveedorY);
        doc.setFont("helvetica", "normal");
        proveedorY += 7;
        doc.text(orden.proveedor.nombre, margin, proveedorY);
        proveedorY += 7;
        doc.text(`NIT: ${orden.proveedor.id}`, margin, proveedorY);
        proveedorY += 7;
        doc.text(orden.proveedor.departamento, margin, proveedorY);
        proveedorY += 7;
        doc.text(orden.proveedor.direccion, margin, proveedorY);
        proveedorY += 7;
        doc.text(orden.proveedor.ciudad, margin, proveedorY);
        proveedorY += 7;
        doc.text(orden.proveedor.telefono, margin, proveedorY);
        proveedorY += 7;
        doc.text(getRegimenTributario(orden.proveedor.regimenTributario) ?? "", margin, proveedorY);
        proveedorY += 7;
        doc.text(orden.proveedor.email, margin, proveedorY);

        // --- Items Table ---
        // Determine the starting y-coordinate for the table based on previous sections
        const tableStartY = Math.max(detailY, entregaY, proveedorY) + 10;

        // Prepare table data similar to the Excel template header:
        const tableColumns = ["CODIGO", "DESCRIPCION", "CANTIDAD", "PRECIO UNITARIO", "SUBTOTAL"];
        const tableRows = orden.itemsOrdenCompra.map((item: ItemOrdenCompra) => [
            item.materiaPrima.productoId,
            item.materiaPrima.nombre,
            item.cantidad,
            item.precioUnitario,
            item.subTotal,
        ]);

        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: tableStartY,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 192, 203] }, // Soft pink header fill
            theme: "grid",
        });

        // --- Totals ---
        // Use the properly typed lastAutoTable to get the final y-coordinate
        const finalY = doc.lastAutoTable?.finalY ?? tableStartY;
        let totalsY = finalY + 10;
        doc.setFont("helvetica", "normal");
        doc.text(`Sub Total: ${orden.subTotal}`, margin, totalsY);
        totalsY += 7;
        doc.text(`IVA (19%): ${orden.iva19}`, margin, totalsY);
        totalsY += 7;
        doc.text(`Total Pagar: ${orden.totalPagar}`, margin, totalsY);

        // --- Leyenda ---
        const leyenda =
            "SEÑOR PROVEEDOR CUANDO ENTREGUE LOS MATERIALES SOLICITADOS ESTOS DEBEN IR CON UN DOCUMENTO QUE INDIQUE EL NUMERO DE ESTA ORDEN, ASI MISMO LAS CANTIDADES SOLICITDAS Y PRECIOS SON LOS QUE HAN SIDO APROBADOS Y ESTAN DESCRITOS EN ESE DOCUMENTO";
        totalsY += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const leyendaLines = doc.splitTextToSize(leyenda, 190);
        doc.text(leyendaLines, margin, totalsY);
        totalsY += leyendaLines.length * 7;

        // --- Observaciones ---
        doc.setFont("helvetica", "bold");
        doc.text("OBSERVACIONES", margin, totalsY);
        totalsY += 7;
        // Draw a rectangle to indicate an area for observations (adjust width/height as desired)
        doc.rect(margin, totalsY, 190, 30);

        // --- Trigger Download ---
        doc.save(`orden-compra-${orden.ordenCompraId}.pdf`);
    }

    /**
     * Helper method to fetch an image from a URL and convert it to a base64 string.
     * @param url the URL of the image.
     * @returns a Promise that resolves with the base64 string.
     */
    private async getImageBase64(url: string): Promise<string> {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject("Error converting image to base64.");
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
