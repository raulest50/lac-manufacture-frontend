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

type SearchResponse<T> = {
    content?: T[];
};

type InsumoWithStockResponse = Omit<InsumoWithStock, "tipo_producto" | "subInsumos"> & {
    tipo_producto?: string;
    tipoProducto?: string;
    tipoUnidades?: string;
    unidad?: string;
    subInsumos?: InsumoWithStockResponse[];
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

class ODPpdfGenerator {
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

    private isSemiterminado(insumo: InsumoWithStock): boolean {
        if (this.toNullableString(insumo.tipo_producto)?.toUpperCase() === "S") {
            return true;
        }

        const nombre = this.toNullableString(insumo.productoNombre)?.toUpperCase();
        return nombre ? nombre.includes("SEMI") : false;
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

    private collectSemiterminados(insumos: InsumoWithStock[]): InsumoWithStock[] {
        const map = new Map<string, InsumoWithStock>();

        const visit = (insumo: InsumoWithStock) => {
            if (this.isSemiterminado(insumo)) {
                const key = this.toNullableString(insumo.productoId) ?? String(insumo.insumoId);
                if (!map.has(key)) {
                    map.set(key, insumo);
                }
            }

            (insumo.subInsumos ?? []).forEach(visit);
        };

        insumos.forEach(visit);
        return Array.from(map.values());
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

    private normalizeInsumoResponse(insumo: InsumoWithStockResponse): InsumoWithStock {
        const subInsumos = Array.isArray(insumo.subInsumos)
            ? insumo.subInsumos.map((child) => this.normalizeInsumoResponse(child))
            : [];

        const productoNombre = this.toNullableString(insumo.productoNombre ?? (insumo as { nombre?: unknown }).nombre) ?? "";

        const rawProductoId = insumo.productoId ?? (insumo as { productoId?: unknown }).productoId;
        const productoId = this.toNullableNumber(rawProductoId) ?? this.toNullableString(rawProductoId) ?? 0;

        return {
            insumoId: this.toNullableNumber(insumo.insumoId) ?? 0,
            productoId,
            productoNombre,
            cantidadRequerida: this.toNullableNumber(insumo.cantidadRequerida) ?? 0,
            stockActual: this.toNullableNumber(insumo.stockActual) ?? 0,
            tipo_producto: this.toNullableString(insumo.tipo_producto ?? insumo.tipoProducto) ?? "",
            tipoUnidades: this.toNullableString(
                insumo.tipoUnidades ?? insumo.unidad ?? (insumo as { tipoUnidades?: unknown }).tipoUnidades,
            ) ?? this.defaultUnidad,
            subInsumos,
        };
    }

    private async fetchInsumosWithStock(productoId: string | null): Promise<{ data: InsumoWithStock[]; error?: string }> {
        // Log del productoId recibido
        console.log("fetchInsumosWithStock - productoId recibido:", productoId, "Tipo:", typeof productoId);

        if (!productoId) {
            console.log("fetchInsumosWithStock - productoId es nulo o vacío");
            return { data: [], error: "Identificador de producto no disponible." };
        }

        try {
            const url = this.endPoints.insumos_with_stock.replace("{id}", encodeURIComponent(productoId));
            console.log("URL para obtener insumos:", url);

            const response = await axios.get<InsumoWithStockResponse[] | SearchResponse<InsumoWithStockResponse>>(url);
            console.log("Respuesta del servidor (insumos):", response.data);

            const payload = response.data;
            const rawInsumos = Array.isArray(payload) ? payload : payload?.content ?? [];
            console.log("Insumos sin procesar:", rawInsumos);

            const data = rawInsumos.map((insumo) => this.normalizeInsumoResponse(insumo));
            console.log("Insumos normalizados:", data);

            return { data };
        } catch (error) {
            console.error("Error en fetchInsumosWithStock:", error);
            const message = this.getErrorMessage(error);
            return { data: [], error: message };
        }
    }

    private async fetchSemiterminadoProcesos(insumo: InsumoWithStock): Promise<SemiterminadoProcesoResult> {
        const semiterminadoId = this.toNullableString(insumo.productoId) ?? String(insumo.insumoId);
        const semiterminadoNombre = this.toNullableString(insumo.productoNombre) ?? `Semiterminado ${semiterminadoId}`;

        if (!this.toNullableString(insumo.productoId)) {
            return {
                semiterminadoId,
                semiterminadoNombre,
                pasos: [],
                error: "Identificador de producto no disponible.",
            };
        }

        try {
            const url = this.endPoints.update_producto.replace("{productoId}", encodeURIComponent(String(insumo.productoId)));
            const response = await axios.get(url);
            console.log(response.data);
            const data = response.data as Record<string, unknown> | undefined;
            const procesos:
                | Array<Record<string, unknown>>
                | undefined = Array.isArray((data as { procesoProduccionCompleto?: { procesosProduccion?: unknown[] } })
                ?.procesoProduccionCompleto?.procesosProduccion)
                ? ((data as { procesoProduccionCompleto?: { procesosProduccion?: unknown[] } })
                      ?.procesoProduccionCompleto?.procesosProduccion as Record<string, unknown>[])
                : Array.isArray((data as { procesoProduccion?: { procesoNodes?: unknown[] } })?.procesoProduccion?.procesoNodes)
                ? ((data as { procesoProduccion?: { procesoNodes?: unknown[] } })?.procesoProduccion?.procesoNodes as Record<string, unknown>[])
                : undefined;

            const pasos: ProcesoPaso[] = (procesos ?? []).map((proceso, index) => {
                const procesoData = (proceso as { data?: Record<string, unknown> }).data ?? proceso;
                const nombre =
                    this.toNullableString(
                        (procesoData as { nombre?: unknown }).nombre ??
                            (procesoData as { nombreProceso?: unknown }).nombreProceso ??
                            (procesoData as { label?: unknown }).label ??
                            (proceso as { nombre?: unknown }).nombre,
                    ) ?? `Paso ${index + 1}`;

                const id =
                    this.toNullableString((proceso as { id?: unknown }).id ?? (procesoData as { id?: unknown }).id) ??
                    `paso-${index + 1}`;

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
        } catch (error) {
            return {
                semiterminadoId,
                semiterminadoNombre,
                pasos: [],
                error: this.getErrorMessage(error),
            };
        }
    }

    private async generatePDF(orden: OrdenProduccionDTO): Promise<jsPDFWithAutoTable> {
        // Log de la orden completa para ver todos los datos
        console.log("Orden completa:", orden);

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

        // Antes de llamar a fetchInsumosWithStock
        console.log("ProductoId antes de fetchInsumosWithStock:", orden.productoId, "Tipo:", typeof orden.productoId);
        const { data: insumosTree, error: insumosError } = await this.fetchInsumosWithStock(orden.productoId);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        if (insumosError) {
            doc.text(`Información no disponible (${insumosError})`, margin, currentY);
            currentY += 6;
        } else if (!insumosTree.length) {
            doc.text("No se registran insumos para este producto.", margin, currentY);
            currentY += 6;
        } else {
            const flattened = this.flattenInsumos(insumosTree);
            const multiplicador = orden.cantidadProducir;
            const tableBody = flattened.map(({ item, level }) => {
                const codigo = this.toNullableString(item.productoId) ?? String(item.productoId ?? "");
                const indent = `${"  ".repeat(level)}${level > 0 ? "↳ " : ""}`;
                const unidad = this.toNullableString(item.tipoUnidades) ?? this.defaultUnidad;
                const cantidadBase = item.cantidadRequerida ?? 0;
                const cantidadAjustadaValor =
                    multiplicador !== null && multiplicador !== undefined
                        ? cantidadBase * multiplicador
                        : null;

                return [
                    codigo,
                    `${indent}${item.productoNombre}`.trim(),
                    unidad,
                    this.formatNumber(cantidadBase),
                    cantidadAjustadaValor !== null ? this.formatNumber(cantidadAjustadaValor) : "—",
                ];
            });

            autoTable(doc, {
                head: [["Código", "Nombre", "Unidad", "Cantidad base", "Cantidad ajustada"]],
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
                    1: { halign: "left" },
                },
                theme: "grid",
            });

            currentY = (doc.lastAutoTable?.finalY ?? currentY) + 6;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Procesos de semiterminados", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        if (insumosError) {
            doc.text("Información no disponible por error al obtener insumos.", margin, currentY);
            currentY += 6;
        } else {
            const semiterminados = this.collectSemiterminados(insumosTree);
            if (!semiterminados.length) {
                doc.text("No se identificaron semiterminados asociados a la orden.", margin, currentY);
                currentY += 6;
            } else {
                const procesosResults = await Promise.all(
                    semiterminados.map(async (semi) => this.fetchSemiterminadoProcesos(semi)),
                );

                const procesosBody = procesosResults.flatMap((resultado) => {
                    const encabezado = `${resultado.semiterminadoNombre} (${resultado.semiterminadoId})`;

                    if (resultado.error) {
                        return [[`${encabezado} – Información no disponible (${resultado.error})`, "☐", "—", "—"]];
                    }

                    if (!resultado.pasos.length) {
                        return [[`${encabezado} – Sin procesos registrados`, "☐", "—", "—"]];
                    }

                    return resultado.pasos.map((paso) => [
                        `${encabezado} – ${paso.nombre}`,
                        "☐",
                        paso.duracion ?? "—",
                        paso.responsable ?? "—",
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
                    });

                    currentY = (doc.lastAutoTable?.finalY ?? currentY) + 6;
                }
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

export default ODPpdfGenerator;
