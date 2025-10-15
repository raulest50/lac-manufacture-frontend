import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrdenProduccionDTO, OrdenSeguimientoDTO } from "./types";

interface AutoTableProperties {
    finalY: number;
}

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: AutoTableProperties;
}

type EstadoInfo = {
    label: string;
};

const estadoOrdenMap: Record<number, EstadoInfo> = {
    0: { label: "En Producción" },
    1: { label: "Terminada" },
};

const estadoSeguimientoMap: Record<number, EstadoInfo> = {
    0: { label: "Pendiente" },
    1: { label: "Finalizada" },
};

class ODPpdfGenerator {
    public async downloadPDF(orden: OrdenProduccionDTO): Promise<void> {
        const doc = await this.generatePDF(orden);
        doc.save(`orden-produccion-${orden.ordenId}.pdf`);
    }

    public async getPDFBlob(orden: OrdenProduccionDTO): Promise<Blob> {
        const doc = await this.generatePDF(orden);
        return doc.output("blob");
    }

    private async generatePDF(orden: OrdenProduccionDTO): Promise<jsPDFWithAutoTable> {
        const doc = new jsPDF({ unit: "mm", format: "a4" }) as jsPDFWithAutoTable;
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        let currentY = margin;

        let logoBase64: string | null = null;
        try {
            logoBase64 = await this.getImageBase64("/logo_exotic.png");
        } catch (error) {
            console.error("Error fetching logo image", error);
        }

        if (logoBase64) {
            doc.addImage(logoBase64, "PNG", margin, currentY, 30, 24);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("ORDEN DE PRODUCCIÓN", pageWidth / 2, currentY + 10, { align: "center" });

        const estadoOrdenLabel = estadoOrdenMap[orden.estadoOrden]?.label ?? "Desconocido";
        doc.setFontSize(10);
        doc.text(`Orden ID: ${orden.ordenId}`, pageWidth / 2, currentY + 18, { align: "center" });
        doc.text(`Estado: ${estadoOrdenLabel}`, pageWidth / 2, currentY + 24, { align: "center" });

        currentY += 32;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Napolitana J.P S.A.S.", margin, currentY);
        currentY += 4;
        doc.text("Nit: 901751897-1", margin, currentY);
        currentY += 4;
        doc.text("Tel: 301 711 51 81", margin, currentY);
        currentY += 4;
        doc.text("produccion.exotic@gmail.com", margin, currentY);

        let detailY = margin + 20;
        const detailX = pageWidth - margin - 60;
        doc.setFontSize(8);
        doc.text("Fecha inicio:", detailX, detailY);
        doc.text(this.formatDate(orden.fechaInicio), detailX + 24, detailY);
        detailY += 4;
        doc.text("Fecha lanzamiento:", detailX, detailY);
        doc.text(this.formatDate(orden.fechaLanzamiento), detailX + 24, detailY);
        detailY += 4;
        doc.text("Fecha final planificada:", detailX, detailY);
        doc.text(this.formatDate(orden.fechaFinalPlanificada), detailX + 30, detailY);

        currentY += 12;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Resumen del producto", margin, currentY);
        currentY += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const productoInfo = [
            `Producto: ${orden.productoNombre}`,
            `Número de lotes: ${this.formatNullableNumber(orden.numeroLotes)}`,
            `Pedido comercial: ${orden.numeroPedidoComercial ?? "No especificado"}`,
            `Área operativa: ${orden.areaOperativa ?? "No especificada"}`,
            `Departamento operativo: ${orden.departamentoOperativo ?? "No especificado"}`,
        ];
        productoInfo.forEach((line) => {
            doc.text(line, margin, currentY);
            currentY += 5;
        });

        currentY += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Observaciones", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const observaciones = orden.observaciones?.trim();
        const obsText = observaciones && observaciones.length > 0 ? observaciones : "Sin observaciones";
        const obsLines = doc.splitTextToSize(obsText, pageWidth - margin * 2);
        doc.text(obsLines, margin, currentY);
        currentY += obsLines.length * 4 + 4;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Seguimiento", margin, currentY);
        currentY += 4;

        if (orden.ordenesSeguimiento && orden.ordenesSeguimiento.length > 0) {
            const tableBody = orden.ordenesSeguimiento.map((seguimiento: OrdenSeguimientoDTO, index: number) => [
                `${index + 1}`,
                seguimiento.insumoNombre,
                seguimiento.cantidadRequerida.toString(),
                estadoSeguimientoMap[seguimiento.estado]?.label ?? "Desconocido",
            ]);

            autoTable(doc, {
                head: [["Seguimiento", "Insumo", "Cantidad requerida", "Estado"]],
                body: tableBody,
                startY: currentY,
                styles: {
                    fontSize: 8,
                    halign: "center",
                    valign: "middle",
                },
                headStyles: {
                    fillColor: [255, 192, 203],
                    textColor: 40,
                },
                columnStyles: {
                    1: { halign: "left" },
                },
                theme: "grid",
            });

            currentY = (doc.lastAutoTable?.finalY ?? currentY) + 6;
        } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("No se registran seguimientos para esta orden.", margin, currentY + 4);
            currentY += 10;
        }

        return doc;
    }

    private formatDate(date: string | null): string {
        if (!date) {
            return "No disponible";
        }
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) {
            return "No disponible";
        }
        return parsed.toLocaleDateString();
    }

    private formatNullableNumber(value: number | null): string {
        return value !== null && value !== undefined ? value.toString() : "No especificado";
    }

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

export default ODPpdfGenerator;
