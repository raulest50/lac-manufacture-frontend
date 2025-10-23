import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL";
import { InsumoWithStock, OrdenProduccionDTO } from "./types";

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

type Data4PDFProductoResponse = {
    productoId?: unknown;
    nombre?: unknown;
    tipo_producto?: unknown;
    tipoProducto?: unknown;
    tipoUnidades?: unknown;
    unidad?: unknown;
    insumos?: Data4PDFInsumoResponse[];
};

type Data4PDFInsumoResponse = {
    insumoId?: unknown;
    cantidadRequerida?: unknown;
    stockActual?: unknown;
    producto?: Data4PDFProductoResponse;
    productoNombre?: unknown;
    tipo_producto?: unknown;
    tipoProducto?: unknown;
    tipoUnidades?: unknown;
    unidad?: unknown;
    subInsumos?: Data4PDFInsumoResponse[];
    insumos?: Data4PDFInsumoResponse[];
};

type Data4PDFProcesoResponse = Record<string, unknown> & {
    data?: Record<string, unknown>;
};

type Data4PDFSemiterminadoResponse = {
    productoId?: unknown;
    nombre?: unknown;
    procesoProduccionCompleto?: {
        procesosProduccion?: Data4PDFProcesoResponse[];
    };
};

type Data4PDFResponse = {
    terminado?: {
        insumos?: Data4PDFInsumoResponse[];
    };
    semiterminados?: Data4PDFSemiterminadoResponse[];
};

type ProcesoPaso = {
    id: string;
    nombre: string;
    duracion?: string | null;
    responsable?: string | null;
};

type SemiterminadoProcesoResult = {
    semiterminadoId: string;
    semiterminadoNombre: string;
    pasos: ProcesoPaso[];
    error?: string;
};

export default class ODPpdfGenerator {
    private readonly endPoints = new EndPointsURL();
    private readonly defaultUnidad = "KG";

    public async downloadPDF(orden: OrdenProduccionDTO): Promise<void> {
        const doc = await this.generatePDF(orden);
        doc.save(`orden-produccion-${orden.ordenId}.pdf`);
    }

    public async getPDFBlob(orden: OrdenProduccionDTO): Promise<Blob> {
        const doc = await this.generatePDF(orden);
        return doc.output("blob");
    }

    private toNullableString(value: unknown): string | null {
        if (value === null || value === undefined) {
            return null;
        }

        const str = String(value).trim();
        return str.length > 0 ? str : null;
    }

    private toNullableNumber(value: unknown): number | null {
        if (value === null || value === undefined) {
            return null;
        }

        if (typeof value === "number") {
            return Number.isFinite(value) ? value : null;
        }

        if (typeof value === "string") {
            const trimmed = value.trim();
            if (!trimmed) {
                return null;
            }
            const parsed = Number(trimmed);
            return Number.isFinite(parsed) ? parsed : null;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    private formatNumber(value: number | null | undefined, decimals = 3): string {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return "—";
        }

        return value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    private flattenInsumos(insumos: InsumoWithStock[], level = 0): Array<{ item: InsumoWithStock; level: number }> {
        return insumos.flatMap((insumo) => {
            const current = [{ item: insumo, level }];
            const children = Array.isArray(insumo.subInsumos)
                ? this.flattenInsumos(insumo.subInsumos, level + 1)
                : [];
            return current.concat(children);
        });
    }

    private buildDurationLabel(data: Record<string, unknown> | undefined): string | null {
        if (!data) {
            return null;
        }

        const tiempo = this.toNullableString((data as { tiempo?: unknown }).tiempo);
        const unidadesTiempo = this.toNullableString((data as { unidadesTiempo?: unknown }).unidadesTiempo);
        if (tiempo && unidadesTiempo) {
            return `${tiempo} ${unidadesTiempo}`;
        }

        if (tiempo) {
            return tiempo;
        }

        return this.toNullableString((data as { tiempoPlanificado?: unknown }).tiempoPlanificado) ?? unidadesTiempo ?? null;
    }

    private getErrorMessage(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;
            return responseMessage ?? error.message;
        }

        if (error instanceof Error) {
            return error.message;
        }

        return typeof error === "string" ? error : "Error desconocido";
    }

    private normalizeData4PDFInsumos(insumos: Data4PDFInsumoResponse[] | undefined): InsumoWithStock[] {
        if (!Array.isArray(insumos)) {
            return [];
        }

        return insumos.map((insumo, index) => this.normalizeData4PDFInsumo(insumo, index));
    }

    private normalizeData4PDFInsumo(insumo: Data4PDFInsumoResponse, fallbackIndex: number): InsumoWithStock {
        const producto = insumo.producto ?? {};

        const rawProductoId =
            (producto as { productoId?: unknown }).productoId ?? (insumo as { productoId?: unknown }).productoId;
        const productoId =
            this.toNullableNumber(rawProductoId) ?? this.toNullableString(rawProductoId) ?? fallbackIndex;

        const rawInsumoId = (insumo as { insumoId?: unknown }).insumoId;
        const insumoId = this.toNullableNumber(rawInsumoId) ?? (typeof productoId === "number" ? productoId : fallbackIndex);

        const productoNombre =
            this.toNullableString((producto as { nombre?: unknown }).nombre ?? insumo.productoNombre) ??
            this.toNullableString((insumo as { nombre?: unknown }).nombre) ??
            "";

        const cantidadRequerida = this.toNullableNumber(insumo.cantidadRequerida) ?? 0;
        const stockActual = this.toNullableNumber(insumo.stockActual) ?? 0;

        const tipoProducto =
            this.toNullableString((producto as { tipo_producto?: unknown }).tipo_producto) ??
            this.toNullableString((producto as { tipoProducto?: unknown }).tipoProducto) ??
            this.toNullableString(insumo.tipo_producto ?? insumo.tipoProducto) ??
            "";

        const unidad =
            this.toNullableString((producto as { tipoUnidades?: unknown }).tipoUnidades) ??
            this.toNullableString((producto as { unidad?: unknown }).unidad) ??
            this.toNullableString(insumo.tipoUnidades ?? insumo.unidad) ??
            this.defaultUnidad;

        const rawChildren = Array.isArray(insumo.subInsumos)
            ? insumo.subInsumos
            : Array.isArray(insumo.insumos)
            ? insumo.insumos
            : Array.isArray((producto as { insumos?: Data4PDFInsumoResponse[] }).insumos)
            ? (producto as { insumos?: Data4PDFInsumoResponse[] }).insumos
            : [];

        return {
            insumoId,
            productoId,
            productoNombre,
            cantidadRequerida,
            stockActual,
            tipo_producto: tipoProducto,
            tipoUnidades: unidad,
            subInsumos: this.normalizeData4PDFInsumos(rawChildren),
        };
    }

    private async fetchData4PDF(
        productoId: string | null,
    ): Promise<{ data: InsumoWithStock[]; semiterminadoProcesos: SemiterminadoProcesoResult[]; error?: string }> {
        console.log("fetchData4PDF - productoId recibido:", productoId, "Tipo:", typeof productoId);

        if (!productoId) {
            console.log("fetchData4PDF - productoId es nulo o vacío");
            return { data: [], error: "Identificador de producto no disponible." };
        }

        try {
            const url = this.endPoints.produccion_terminado_data4pdf.replace("{id}", encodeURIComponent(productoId));
            console.log("URL para obtener data4pdf:", url);

            const response = await axios.get<Data4PDFResponse>(url);
            console.log("Respuesta del servidor (data4pdf):", response.data);

            const rawInsumos = response.data?.terminado?.insumos;
            const data = this.normalizeData4PDFInsumos(rawInsumos);
            console.log("Insumos normalizados desde data4pdf:", data);

            const rawSemiterminados = Array.isArray(response.data?.semiterminados)
                ? response.data?.semiterminados
                : [];

            const semiterminadoProcesos = rawSemiterminados.map((semi, index) => {
                const semiterminadoId =
                    this.toNullableString((semi as { productoId?: unknown }).productoId) ?? `semi-${index + 1}`;
                const semiterminadoNombre =
                    this.toNullableString((semi as { nombre?: unknown }).nombre) ??
                    `Semiterminado ${semiterminadoId}`;

                const procesosRaw = (semi as Data4PDFSemiterminadoResponse)?.procesoProduccionCompleto?.procesosProduccion;
                const procesosArray = Array.isArray(procesosRaw) ? procesosRaw : [];

                const pasos: ProcesoPaso[] = procesosArray.map((proceso, pasoIndex) => {
                    const procesoData =
                        (proceso as { data?: Record<string, unknown> }).data ?? (proceso as Record<string, unknown>);
                    const nombre =
                        this.toNullableString(
                            (procesoData as { nombre?: unknown }).nombre ??
                                (procesoData as { nombreProceso?: unknown }).nombreProceso ??
                                (procesoData as { label?: unknown }).label ??
                                (proceso as { nombre?: unknown }).nombre,
                        ) ?? `Paso ${pasoIndex + 1}`;

                    const id =
                        this.toNullableString((proceso as { id?: unknown }).id ?? (procesoData as { id?: unknown }).id) ??
                        `paso-${pasoIndex + 1}`;

                    const responsable = this.toNullableString(
                        (procesoData as { responsable?: unknown }).responsable ??
                            (procesoData as { responsableNombre?: unknown }).responsableNombre ??
                            (procesoData as { encargado?: unknown }).encargado,
                    );

                    const duracion = this.buildDurationLabel(procesoData);

                    return {
                        id,
                        nombre,
                        duracion,
                        responsable,
                    };
                });

                return {
                    semiterminadoId,
                    semiterminadoNombre,
                    pasos,
                };
            });

            return { data, semiterminadoProcesos };
        } catch (error) {
            console.error("Error en fetchData4PDF:", error);
            const message = this.getErrorMessage(error);
            return { data: [], semiterminadoProcesos: [], error: message };
        }
    }

    private async generatePDF(orden: OrdenProduccionDTO): Promise<jsPDFWithAutoTable> {
        // Log de la orden completa para ver todos los datos
        console.log("Orden completa:", orden);

        const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" }) as jsPDFWithAutoTable;
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
        // Antes de formatear la cantidad a producir
        console.log("Cantidad a producir:", orden.cantidadProducir, "Tipo:", typeof orden.cantidadProducir);
        const productoInfo = [
            `Producto: ${orden.productoNombre}`,
            `Cantidad a producir: ${this.formatNullableNumber(orden.cantidadProducir)}`,
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
        doc.text("Árbol de insumos", margin, currentY);
        currentY += 6;

        // Antes de llamar a fetchData4PDF
        console.log("ProductoId antes de fetchData4PDF:", orden.productoId, "Tipo:", typeof orden.productoId);
        const {
            data: insumosTree,
            semiterminadoProcesos,
            error: insumosError,
        } = await this.fetchData4PDF(orden.productoId);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const flattened = !insumosError && insumosTree.length ? this.flattenInsumos(insumosTree) : [];
        const multiplicador = orden.cantidadProducir ?? 0;
        const tableBody = flattened.map(({ item, level }) => {
            const codigo = this.toNullableString(item.productoId) ?? String(item.productoId ?? "");
            const indent = `${"  ".repeat(level)}${level > 0 ? "↳ " : ""}`;
            const unidad = this.toNullableString(item.tipoUnidades) ?? this.defaultUnidad;
            const cantidadBase = item.cantidadRequerida ?? 0;
            const cantidadADispensar = cantidadBase * multiplicador;
            const nombreMaterial = level > 0 ? `${indent}${item.productoNombre}` : item.productoNombre;

            return [
                codigo,
                nombreMaterial,
                unidad,
                "",
                this.formatNumber(cantidadADispensar),
                "",
                "",
            ];
        });

        if (insumosError) {
            doc.text(`Información no disponible (${insumosError})`, margin, currentY);
            currentY += 6;
        } else if (!insumosTree.length) {
            doc.text("No se registran insumos para este producto.", margin, currentY);
            currentY += 6;
        }

        autoTable(doc, {
            head: [[
                "Código Insumo",
                "Nombre Insumo",
                "Unidad de medida",
                "Lote",
                "Cantidad a dispensar",
                "Responsable Dispensación",
                "Área de Ejecucion",
            ]],
            body: tableBody,
            startY: currentY,
            styles: {
                fontSize: 8,
                halign: "center",
                valign: "middle",
            },
            headStyles: {
                fillColor: [217, 234, 249],
                textColor: 40,
            },
            columnStyles: {
                0: { cellWidth: 22 },
                1: { halign: "left", cellWidth: 60 },
                2: { cellWidth: 26 },
                4: { halign: "right", cellWidth: 32 },
            },
            theme: "grid",
        });

        currentY = (doc.lastAutoTable?.finalY ?? currentY) + 6;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Procesos de semiterminados", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        if (insumosError) {
            doc.text("Información no disponible por error al obtener insumos.", margin, currentY);
            currentY += 6;
        } else if (!semiterminadoProcesos.length) {
            doc.text("No se identificaron semiterminados asociados a la orden.", margin, currentY);
            currentY += 6;
        } else {
            const procesosBody = semiterminadoProcesos.flatMap((resultado) => {
                const encabezado = `${resultado.semiterminadoNombre} (${resultado.semiterminadoId})`;

                if (resultado.error) {
                    return [[`${encabezado} – Información no disponible (${resultado.error})`, "", "—", "—"]];
                }

                if (!resultado.pasos.length) {
                    return [[`${encabezado} – Sin procesos registrados`, "", "—", "—"]];
                }

                return resultado.pasos.map((paso) => [
                    `${encabezado} – ${paso.nombre}`,
                    "",
                    paso.duracion && paso.duracion.trim().length > 0 ? paso.duracion : "—",
                    paso.responsable && paso.responsable.trim().length > 0 ? paso.responsable : "—",
                ]);
            });

            if (!procesosBody.length) {
                doc.text("Información no disponible.", margin, currentY);
                currentY += 6;
            } else {
                autoTable(doc, {
                    head: [["Proceso / Paso", "Checklist", "Duración", "Responsable"]],
                    body: procesosBody,
                    startY: currentY,
                    styles: {
                        fontSize: 8,
                        halign: "center",
                        valign: "middle",
                    },
                    headStyles: {
                        fillColor: [234, 223, 255],
                        textColor: 40,
                    },
                    columnStyles: {
                        0: { halign: "left" },
                        1: { halign: "center" },
                        2: { halign: "center" },
                        3: { halign: "center" },
                    },
                    theme: "grid",
                    // Dibujar manualmente los checkboxes
                    didDrawCell: (data) => {
                        if (data.section === "body" && data.column.index === 1) {
                            const { x, y, width, height } = data.cell;
                            const size = Math.min(5, height - 2);        // tamaño del checkbox
                            const cx = x + (width - size) / 2;           // centrado horizontal
                            const cy = y + (height - size) / 2;          // centrado vertical
                            data.doc.setLineWidth(0.3);
                            data.doc.rect(cx, cy, size, size);           // dibuja el cuadro
                        }
                    },
                });

                currentY = (doc.lastAutoTable?.finalY ?? currentY) + 6;
            }
        }

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
        console.log("formatNullableNumber - valor recibido:", value, "Tipo:", typeof value);
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
