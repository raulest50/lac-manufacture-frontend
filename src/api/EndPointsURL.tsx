
export default class EndPointsURL{

    // producto resource
    public search_mprima:string;
    public search_semi:string;
    public save_producto:string;
    public update_producto:string;
    public insumos_with_stock:string;
    public search_semiytermi:string;

    public search_terminado_byname:string;
    public search_semi_byname_4pd:string;

    public save_mprima_v2: string;

    public search_p4_receta_v2: string;

    public carga_masiva_mprims: string; // el primer endpoint para carga masiva
    public consulta_productos:string; // para buscar por categorias

    // familias endpoints
    public get_familias: string;
    public save_familia: string;


    // Proveedores resouce
    public save_proveedores:string;
    public search_proveedores:string;
    public search_proveedores_pag :string;
    public update_proveedores:string;

    // produccion resource
    public save_produccion:string;
    public search_ordenes_within_range:string;
    public inventario_en_transito:string;
    public orden_seguimiento_update_estado:string;
    public orden_produccion_update_estado:string;
    public search_ordenes_by_responsable:string;


    // compras resource
    public byProveedorAndDate:string;
    public get_compra_items_by_compra_id:string
    public search_ordenc_date_estado:string;

    public save_orden_compra: string;
    public update_orden_compra: string;


    // movimientos resource
    public search_products_with_stock:string;
    public get_movimientos_by_producto:string;

    public save_doc_ingreso_oc: string;



    // user resources (solo autenticacion)
    public whoami:string;
    public login:string;
    public request_reset_passw:string;
    public set_new_passw:string;

    // users management CRUD operations
    public get_all_users: string;
    public deactivate_user: string;
    public activate_user: string;


    // integrantes de personal
    public save_integrante_personal: string;

    // bulk uploads por link
    public bulk_upload_proveedores: string;
    public bulk_upload_productos: string;

    // organigrama endpoints
    public get_all_cargos: string;
    public save_cargo_with_manual: string;
    public save_changes_organigrama: string;

    // just in case of need
    // contabilidad resource
    public get_cuentas: string;
    // public save_cuenta: string;
    // public update_cuenta: string;
    public get_periodos: string;
    // public save_periodo: string;
    // public update_periodo: string;
    // public update_periodo_estado: string;
    // public get_asientos: string;
    // public save_asiento: string;
    // public update_asiento: string;
    public get_libro_mayor: string;
    // public get_balance_comprobacion: string;
    // public get_balance_general: string;
    // public get_estado_resultados: string;

    public domain: string;

    constructor() {

        this.domain = EndPointsURL.getDomain();
        const domain = this.domain;

        const productos_res = 'productos';
        const proveedores_res = 'proveedores';
        const compras_res = 'compras';
        const produccion_res = 'produccion';
        const movimientos_res = 'movimientos';
        const contabilidad_res = 'api/contabilidad';
        const auth_res = 'api/auth';
        const personal_res = 'integrantes-personal';

        // productos endpoints
        this.search_mprima = `${domain}/${productos_res}/search_mprima`;
        this.search_semi = `${domain}/${productos_res}/search_semi`;
        this.save_producto = `${domain}/${productos_res}/save`;
        this.update_producto = `${domain}/${productos_res}/{productoId}`;
        this.insumos_with_stock = `${domain}/${productos_res}/{id}/insumos_with_stock`;
        this.search_semiytermi = `${domain}/${productos_res}/search_semiytermi`;
        this.search_p4_receta_v2 = `${domain}/${productos_res}/search_p4_receta_v2`;

        this.save_mprima_v2 = `${domain}/${productos_res}/save_mprima_v2`;

        this.search_terminado_byname = `${domain}/${productos_res}/search_terminados`;
        this.search_semi_byname_4pd = `${domain}/${productos_res}/search_semi_4pd`;

        this.carga_masiva_mprims = `${domain}/${productos_res}/bulk_upload_excel`;
        this.consulta_productos = `${domain}/${productos_res}/consulta1`;

        // Familias endpoints
        this.get_familias = `${domain}/${productos_res}/familias`;
        this.save_familia = `${domain}/${productos_res}/familias/save`;

        // Proveedores endpoints
        this.save_proveedores = `${domain}/${proveedores_res}/save`;
        this.search_proveedores = `${domain}/${proveedores_res}/search`;
        this.search_proveedores_pag = `${domain}/${proveedores_res}/search_pag`;
        this.update_proveedores = `${domain}/${proveedores_res}/{id}`;
        this.bulk_upload_proveedores = `${domain}/api/bulk-upload/proveedores`;
        this.bulk_upload_productos = `${domain}/api/bulk-upload/products`;

        // compras endpoints
        this.byProveedorAndDate = `${domain}/${compras_res}/byProveedorAndDate`;
        this.get_compra_items_by_compra_id = `${domain}/${compras_res}/{compraId}/items`;
        this.save_orden_compra = `${domain}/${compras_res}/save_orden_compra`;
        this.search_ordenc_date_estado = `${domain}/${compras_res}/search_ordenes_by_date_estado`;
        this.update_orden_compra = `${domain}/${compras_res}/update_orden_compra`;

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

        this.save_doc_ingreso_oc = `${domain}/${movimientos_res}/save_doc_ingreso_oc`;

        // user endpoints
        this.whoami = `${domain}/${auth_res}/whoami`;
        this.login = `${domain}/${auth_res}/login`;
        this.request_reset_passw = `${domain}/${auth_res}/request_reset_passw`;
        this.set_new_passw = `${domain}/${auth_res}/set_new_passw`;
        this.get_all_users = `${domain}/usuarios`;
        this.deactivate_user = `${domain}/usuarios/{userId}/deactivate`;
        this.activate_user = `${domain}/usuarios/{userId}/activate`;

        // integrantes de personal endpoints
        this.save_integrante_personal = `${domain}/${personal_res}/save`;

        // contabilidad endpoints
        this.get_cuentas = `${domain}/${contabilidad_res}/cuentas`;
        this.get_libro_mayor = `${domain}/${contabilidad_res}/libro-mayor`;
        this.get_periodos = `${domain}/${contabilidad_res}/periodos`;

        // organigrama endpoints
        const organigrama_res = 'organigrama';
        this.get_all_cargos = `${domain}/${organigrama_res}`;
        this.save_cargo_with_manual = `${domain}/${organigrama_res}/save_mfunciones`;
        this.save_changes_organigrama = `${domain}/${organigrama_res}/save_changes_organigrama`;
    }


    // Method to return the correct domain name
    static getDomain(): string {
        //console.log(window.location.hostname);
        // Check if running on localhost
        if (window.location.hostname === "localhost") {
            return "http://localhost:8080"
        } else {
            return "https://lac-manufacture-backend.onrender.com";
        }
    }



}
