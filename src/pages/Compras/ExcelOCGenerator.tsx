// ExcelOCGenerator.ts
import ExcelJS from 'exceljs';
import {getCondicionPagoText, getRegimenTributario, OrdenCompra} from './types'; // Adjust the path as needed

export class ExcelOCGenerator {
    /**
     * Generates an Excel file for the given OrdenCompra.
     * @param orden the order data to populate the file with.
     * @returns a Promise that resolves to a Uint8Array containing the Excel file.
     */
    public async generateExcel(orden: OrdenCompra): Promise<Uint8Array> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orden Compra');

        // === Example: Header Section ===
        // Merge cells E1 to I3 and set the title "ORDEN DE COMPRA"
        worksheet.mergeCells('A1:B7'); // logo
        worksheet.getColumn('A').width = 21;
        worksheet.getColumn('B').width = 21;
        worksheet.getColumn('C').width = 12;
        worksheet.getColumn('D').width = 9;
        worksheet.getColumn('E').width = 14;
        worksheet.getColumn('F').width = 12;
        worksheet.getColumn('G').width = 14;
        worksheet.getColumn('H').width = 14;
        worksheet.getColumn('I').width = 30;


        const response = await fetch('/logo_exotic.png');
        const blob = await response.blob();
        const base64PNG = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('Conversion to base64 failed');
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        const imageId = workbook.addImage({
            base64: base64PNG,
            extension: 'png',
        });
        worksheet.addImage(imageId, {
            tl: { col: 0.5, row: 0 }, // Position A1 (col: 0, row: 0)
            ext: { width: 170, height: 130 } // Set image dimensions
        });


        worksheet.mergeCells('A8:B8'); // napolitana razon social
        worksheet.getCell('A8').value = "Napolitana J.P S.A.S.";
        worksheet.mergeCells('A9:B9'); // napolitana nit
        worksheet.getCell('A9').value = "Nit: 901751897-1";
        worksheet.mergeCells('A10:B10'); // napolitana tel
        worksheet.getCell('A10').value = "Tel: 301 711 51 81";
        worksheet.mergeCells('A11:B11'); // napolitana email
        worksheet.getCell('A11').value = "jorgerafaelpereiraosorio1@gmail.com";


        worksheet.mergeCells('E1:I3');
        const headerCell = worksheet.getCell('E1');
        headerCell.value = 'ORDEN DE COMPRA';
        headerCell.font = {
            name: 'Artifakt Element Medium',
            size: 24,
            bold: true,
            color: { argb: 'FF00B050' }
        };
        headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


        // Write the order fecha emision in cell I4
        worksheet.mergeCells('F4:H4');
        this.setNormalFormat(worksheet.getCell('F4'), "FECHA EMISION ORDEN DE COMPRA");
        this.setNormalFormat(worksheet.getCell('I4'), orden.fechaEmision?.toString());

        // Write the order ID in cell I5
        worksheet.mergeCells('F5:H5');
        this.setNormalFormat(worksheet.getCell('F5'), "NUMERO DE ORDEN DE COMPRA");
        this.setNormalFormat(worksheet.getCell('I5'), orden.ordenCompraId);

        worksheet.mergeCells('F6:H6');
        this.setNormalFormat(worksheet.getCell('F6'), "FECHA DE VENCIMIENTO DE LA ORDEN");
        this.setNormalFormat(worksheet.getCell('I6'), orden.fechaVencimiento?.toString());

        //LUGAR DE ENTREGA Y CONDICIONES DE PAGO
        worksheet.mergeCells('F13:I13');
        this.setHeaderFormat(worksheet.getCell('F13'), "LUGAR DE ENTREGA Y CONDICIONES DE PAGO");
        worksheet.mergeCells('F14:I14');
        this.setNormalFormat(worksheet.getCell('F14'), "Nombre Empresa: EXOTIC EXPERT");
        worksheet.mergeCells('F15:I15');
        this.setNormalFormat(worksheet.getCell('F15'), "Direccion : vía 11, Juan Mina #4 100");
        worksheet.mergeCells('F16:I16');
        this.setNormalFormat(worksheet.getCell('F16'), "Barranquilla, Atlántico");
        worksheet.mergeCells('F17:I17');
        this.setNormalFormat(worksheet.getCell('F17'), "[TELEFONO PLANTA EXOTIC]");
        worksheet.mergeCells('F18:I18');
        this.setNormalFormat(worksheet.getCell('F18'), getCondicionPagoText(orden.condicionPago));
        worksheet.mergeCells('F19:I19');
        this.setNormalFormat(worksheet.getCell('F19'), `PLAZO PAGO ${orden.plazoPago} DIAS`);
        worksheet.mergeCells('F20:I20');
        this.setNormalFormat(worksheet.getCell('F20'), `PLAZO ENTREGA ${orden.tiempoEntrega} DIAS`);
        worksheet.mergeCells('F21:I21');
        this.setNormalFormat(worksheet.getCell('F21'), `CONDICION ENTREGA: PUESTA EN PLANTA`);


        // INFORMACION PROVEEDOR
        worksheet.mergeCells('A13:B13');
        this.setHeaderFormat(worksheet.getCell('A13'), "PROVEEDOR");
        worksheet.mergeCells('A14:B14');
        this.setNormalFormat(worksheet.getCell('A14'), orden.proveedor.nombre);
        worksheet.mergeCells('A15:B15');
        this.setNormalFormat(worksheet.getCell('A15'), `NIT: ${orden.proveedor.id}`);
        worksheet.mergeCells('A16:B16');
        this.setNormalFormat(worksheet.getCell('A16'), orden.proveedor.departamento);
        worksheet.mergeCells('A17:B17');
        this.setNormalFormat(worksheet.getCell('F17'), orden.proveedor.direccion);
        worksheet.mergeCells('A18:B18');
        this.setNormalFormat(worksheet.getCell('A18'), orden.proveedor.ciudad);
        worksheet.mergeCells('A19:B19');
        this.setNormalFormat(worksheet.getCell('A19'), orden.proveedor.telefono);
        worksheet.mergeCells('A20:B20');
        this.setNormalFormat(worksheet.getCell('A20'), getRegimenTributario(orden.proveedor.regimenTributario));
        worksheet.mergeCells('A21:B21');
        this.setNormalFormat(worksheet.getCell('A21'), orden.proveedor.email);

        // Convert the workbook buffer (an ArrayBuffer) into a Uint8Array
        const arrayBuffer = await workbook.xlsx.writeBuffer();
        return new Uint8Array(arrayBuffer);
    }

    private setNormalFormat(cell: ExcelJS.Cell, value: string | (number|undefined)){
        cell.value = value;
        cell.font = { name: 'Artifakt Element Medium', size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
    }

    private setHeaderFormat(cell: ExcelJS.Cell, value: string | (number|undefined)){
        cell.value = value;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00B050' }
        };
        cell.font = { name: 'Artifakt Element Medium', size: 14, color: { argb: '00000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
    }

    /**
     * Generates the Excel file and triggers a download in the browser.
     * @param orden the order data to populate the file with.
     */
    public async downloadExcel(orden: OrdenCompra): Promise<void> {
        try {
            const buffer = await this.generateExcel(orden);
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orden-compra-${orden.ordenCompraId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating Excel file:', error);
            throw error;
        }
    }
}
