
export default class EndPointsURL{

    // producto resource
    public search_mprima:string;
    public search_semi:string;
    public save_producto:string;
    public insumos_with_stock:string;
    public search_semiytermi:string;


    // Proveedores resouce
    public save_proveedores:string;
    public search_proveedores:string;
    public search_proveedores_pag :string;


    // produccion resource
    public save_produccion:string;
    public search_ordenes_within_range:string;
    public inventario_en_transito:string;
    public orden_seguimiento_update_estado:string;
    public orden_produccion_update_estado:string;
    public search_ordenes_by_responsable:string;


    // compras resource
    public save_compra:string;
    public byProveedorAndDate:string;
    public get_compra_items_by_compra_id:string


    // movimientos resource
    public search_products_with_stock:string;
    public get_movimientos_by_producto:string;


    // user resources
    public whoami:string;


    constructor() {

        const domain = EndPointsURL.getDomain();

        const productos_res = 'productos';
        const proveedores_res = 'Proveedores';
        const compras_res = 'compras';
        const produccion_res = 'produccion';
        const movimientos_res = 'movimientos';
        const user_res = 'user';

        // productos endpoints
        this.search_mprima = `${domain}/${productos_res}/search_mprima`;
        this.search_semi = `${domain}/${productos_res}/search_semi`;
        this.save_producto = `${domain}/${productos_res}/save`;
        this.insumos_with_stock = `${domain}/${productos_res}/{id}/insumos_with_stock`;
        this.search_semiytermi = `${domain}/${productos_res}/search_semiytermi`;

        // Proveedores endpoints
        this.save_proveedores = `${domain}/${proveedores_res}/save`;
        this.search_proveedores = `${domain}/${proveedores_res}/search`;
        this.search_proveedores_pag = `${domain}/${proveedores_res}/search_pag`;

        // compras endpoints
        this.save_compra = `${domain}/${compras_res}/save`;
        this.byProveedorAndDate = `${domain}/${compras_res}/byProveedorAndDate`;
        this.get_compra_items_by_compra_id = `${domain}/${compras_res}/{compraId}/items`;

        // produccion endpoints
        this.save_produccion = `${domain}/${produccion_res}/save`;
        this.search_ordenes_within_range = `${domain}/${produccion_res}/search_within_range`;
        this.inventario_en_transito = `${domain}/${produccion_res}/inventario_en_transito`;
        this.orden_seguimiento_update_estado = `${domain}/${produccion_res}/orden_seguimiento/{id}/update_estado`;
        this.orden_produccion_update_estado = `${domain}/${produccion_res}/orden_produccion/{id}/update_estado`;
        this.search_ordenes_by_responsable = `${domain}/${produccion_res}/ordenes_produccion/responsable/{responsableId}`;

        // movimientos endpoints
        this.search_products_with_stock = `${domain}/${movimientos_res}/search_products_with_stock`;
        this.get_movimientos_by_producto = `${domain}/${movimientos_res}/get_movimientos_by_producto`;

        // user endpoints
        this.whoami = `${domain}/${user_res}/whoami`;

    }


    // Method to return the correct domain name
    static getDomain(): string {
        console.log(window.location.hostname);
        // Check if running on localhost
        if (window.location.hostname === "localhost") {
            return "http://localhost:8080"
        } else {
            return "https://lac-manufacture-backend.onrender.com";
        }
    }



}