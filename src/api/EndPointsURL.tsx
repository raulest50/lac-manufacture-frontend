
export default class EndPointsURL{

    // producto resource
    public search_mprima:string;
    public search_semi:string;
    public save_producto:string;
    public insumos_with_stock:string;
    public search_semiytermi:string;


    // proveedores resouce
    public save_proveedores:string;
    public search_proveedores:string;


    // produccion resource
    public save_produccion:string;


    // compras resource
    public save_compra:string;


    // movimientos resource
    public search_products_with_stock:string;
    public get_movimientos_by_producto:string;

    constructor() {

        const domain = EndPointsURL.getDomain();

        const productos_res = 'productos';
        const proveedores_res = 'proveedores';
        const compras_res = 'compras';
        const produccion_res = 'produccion';
        const movimientos_res = 'movimientos';

        // productos endpoints
        this.search_mprima = `${domain}/${productos_res}/search_mprima`;
        this.search_semi = `${domain}/${productos_res}/search_semi`;
        this.save_producto = `${domain}/${productos_res}/save`;
        this.insumos_with_stock = `${domain}/${productos_res}/{id}/insumos_with_stock`;
        this.search_semiytermi = `${domain}/${productos_res}/search_semiytermi`;

        // proveedores endpoints
        this.save_proveedores = `${domain}/${proveedores_res}/save`;
        this.search_proveedores = `${domain}/${proveedores_res}/search`;

        // compras endpoints
        this.save_compra = `${domain}/${compras_res}/save`;

        // produccion endpoints
        this.save_produccion = `${domain}/${produccion_res}/save`;

        // movimientos endpoints
        this.search_products_with_stock = `${domain}/${movimientos_res}/search_products_with_stock`;
        this.get_movimientos_by_producto = `${domain}/${movimientos_res}/get_movimientos_by_producto`;

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