
export default class EndPointsURL{

    // producto resource
    public search_mprima:string;
    public search_semi:string;
    public save_producto:string;
    public update_producto:string;
    public insumos_with_stock:string;
    public search_semiytermi:string;

    public search_terminado_byname:string;
    public search_terminados_picker:string;
    public search_semi_byname_4pd:string;

    public save_mprima_v2: string;

    public search_p4_receta_v2: string;

    public carga_masiva_mprims: string; // el primer endpoint para carga masiva
    public consulta_productos:string; // para buscar por categorias

    // notifications endpoint
    public module_notifications: string;

    // categorias endpoints
    public get_categorias: string;
    public save_categoria: string;


    // Proveedores resouce
    public save_proveedores:string;
    public search_proveedores:string;
    public search_proveedores_pag :string;
    public update_proveedores:string;

    // Clientes resource
    public save_clientes:string;
    public search_clientes:string;
    public search_clientes_pag:string;
    public update_clientes:string;

    // produccion resource
    public save_produccion:string;
    public search_ordenes_within_range:string;
    public orden_seguimiento_update_estado:string;
    public orden_produccion_update_estado:string;
    public search_ordenes_by_responsable:string;
    public produccion_terminado_data4pdf: string;

    // recursos de produccion
    public save_recurso_produccion:string;
    public search_recurso_produccion:string;
    public update_recurso_produccion:string;
    public activos_fijos_disponibles_rp:string;

    // procesos de produccion
    public save_proceso_produccion:string;
    public get_procesos_produccion_pag:string;
    public update_proceso_produccion:string;


    // compras resource
    public byProveedorAndDate:string;
    public get_compra_items_by_compra_id:string
    public search_ordenc_date_estado:string;

    public save_orden_compra: string;
    public update_orden_compra: string;


    // ventas resource
    public sales: { vendedores: string; };

    // movimientos resource
    public search_products_with_stock:string;
    public get_movimientos_by_producto:string;
    public exportar_movimientos_excel: string;
    public exportar_inventario_excel: string;

    public save_doc_ingreso_oc: string;
    public backflush_no_planificado: string;

    public dispensacion_no_planificada: string;
    public recomendar_lotes_multiple: string;



    // user resources (solo autenticacion)
    public whoami:string;
    public login:string;
    public request_reset_passw:string;
    public set_new_passw:string;

    // users management CRUD operations
    public get_all_users: string;
    public deactivate_user: string;
    public activate_user: string;

    public search_user_by_dto: string;


    // integrantes de personal
    public save_integrante_personal: string;
    public search_integrantes_personal: string;

    // bulk uploads por link
    public bulk_upload_proveedores: string;
    public bulk_upload_productos: string;

    // organigrama endpoints
    public get_all_cargos: string;
    public save_cargo_with_manual: string;
    public save_changes_organigrama: string;

    // activos fijos endpoints
    public save_orden_compra_activo: string;
    public search_ordenes_compra_activo: string;
    public get_orden_compra_activo_by_id: string;
    public cancel_orden_compra_activo: string;
    public get_items_by_orden_compra_activo_id: string;
    public update_orden_compra_activo: string;
    public incorporar_activos_fijos: string;
    public get_activo_fijo: string;
    public update_activo_fijo: string;
    public search_activos_fijos: string;

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
    public search_transacciones_almacen: string;


    //enpoints para management de Areas de Produccion (AreaProduccion)
    public crear_area_produccion: string;
    public area_prod_search_by_name: string;



    // master directives endpoints
    public get_master_directives: string;
    public update_master_directive: string;

    public get_master_directive(nombre: string): string {
        return `${this.domain}/api/master-directives/${encodeURIComponent(nombre)}`;
    }

    public domain: string;

    constructor() {

        this.domain = EndPointsURL.getDomain();
        const domain = this.domain;

        const productos_res = 'productos';
        const proveedores_res = 'proveedores';
        const compras_res = 'compras';
        const produccion_res = 'produccion';
        const movimientos_res = 'movimientos';
        const ventas_res = 'ventas';
        const contabilidad_res = 'api/contabilidad';
        const auth_res = 'api/auth';
        const personal_res = 'integrantes-personal';
        const recursos_produccion_res = 'api/recursos-produccion';
        const procesos_produccion_res = 'api/procesos-produccion';
        const user_management_res = 'usuarios';
        const area_produccion_res = 'api/areas-produccion';

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
        this.search_terminados_picker = `${domain}/${productos_res}/search_terminados_picker`;
        this.search_semi_byname_4pd = `${domain}/${productos_res}/search_semi_4pd`;

        this.carga_masiva_mprims = `${domain}/${productos_res}/bulk_upload_excel`;
        this.consulta_productos = `${domain}/${productos_res}/consulta1`;

        // Categorias endpoints
        this.get_categorias = `${domain}/categorias`;
        this.save_categoria = `${domain}/categorias`;

        // Proveedores endpoints
        this.save_proveedores = `${domain}/${proveedores_res}/save`;
        this.search_proveedores = `${domain}/${proveedores_res}/search`;
        this.search_proveedores_pag = `${domain}/${proveedores_res}/search_pag`;
        this.update_proveedores = `${domain}/${proveedores_res}/{id}`;
        this.bulk_upload_proveedores = `${domain}/api/bulk-upload/proveedores`;
        this.bulk_upload_productos = `${domain}/api/bulk-upload/products`;

        // Clientes endpoints
        this.save_clientes = `${domain}/clientes/save`;
        this.search_clientes = `${domain}/clientes/search`;
        this.search_clientes_pag = `${domain}/clientes/search_pag`;
        this.update_clientes = `${domain}/clientes/{id}/with-files`;

        // compras endpoints
        this.byProveedorAndDate = `${domain}/${compras_res}/byProveedorAndDate`;
        this.get_compra_items_by_compra_id = `${domain}/${compras_res}/{compraId}/items`;
        this.save_orden_compra = `${domain}/${compras_res}/save_orden_compra`;
        this.search_ordenc_date_estado = `${domain}/${compras_res}/search_ordenes_by_date_estado`;
        this.update_orden_compra = `${domain}/${compras_res}/update_orden_compra`;

        // produccion endpoints
        this.save_produccion = `${domain}/${produccion_res}/save`;
        this.search_ordenes_within_range = `${domain}/${produccion_res}/search_within_range`;
        this.orden_seguimiento_update_estado = `${domain}/${produccion_res}/orden_seguimiento/{id}/update_estado`;
        this.orden_produccion_update_estado = `${domain}/${produccion_res}/orden_produccion/{id}/update_estado`;
        this.search_ordenes_by_responsable = `${domain}/${produccion_res}/ordenes_produccion/responsable/{responsableId}`;
        this.produccion_terminado_data4pdf = `${domain}/${produccion_res}/terminado/{id}/data4pdf`;

        // recursos de produccion endpoints
        this.save_recurso_produccion = `${domain}/${recursos_produccion_res}`;
        this.search_recurso_produccion = `${domain}/${recursos_produccion_res}/search`;
        this.update_recurso_produccion = `${domain}/${recursos_produccion_res}/update`;
        this.activos_fijos_disponibles_rp = `${domain}/${recursos_produccion_res}/activos-fijos-disponibles`;

        // procesos de produccion endpoints
        this.save_proceso_produccion = `${domain}/${procesos_produccion_res}`;
        this.get_procesos_produccion_pag = `${domain}/${procesos_produccion_res}/paginados`;
        this.update_proceso_produccion = `${domain}/${procesos_produccion_res}/{id}`;

        // ventas endpoints
        this.sales = {
            vendedores: `${domain}/${ventas_res}/vendedores`,
        };

        // movimientos endpoints
        this.search_products_with_stock = `${domain}/${movimientos_res}/search_products_with_stock`;
        this.get_movimientos_by_producto = `${domain}/${movimientos_res}/get_movimientos_by_producto`;
        this.exportar_movimientos_excel = `${domain}/${movimientos_res}/exportar-movimientos-excel`;
        this.exportar_inventario_excel = `${domain}/inventario/exportar-excel`;

        this.save_doc_ingreso_oc = `${domain}/${movimientos_res}/save_doc_ingreso_oc`;
        this.backflush_no_planificado = `${domain}/${movimientos_res}/backflush_no_planificado`;
        this.dispensacion_no_planificada = `${domain}/${movimientos_res}/dispensacion-no-planificada`;
        this.recomendar_lotes_multiple = `${domain}/${movimientos_res}/recomendar-lotes-multiple`;

        // user endpoints
        this.whoami = `${domain}/${auth_res}/whoami`;
        this.login = `${domain}/${auth_res}/login`;
        this.request_reset_passw = `${domain}/${auth_res}/request_reset_passw`;
        this.set_new_passw = `${domain}/${auth_res}/set_new_passw`;
        this.get_all_users = `${domain}/${user_management_res}`;
        this.deactivate_user = `${domain}/${user_management_res}/{userId}/deactivate`;
        this.activate_user = `${domain}/${user_management_res}/{userId}/activate`;

        this.search_user_by_dto = `${domain}/${user_management_res}/search_by_dto`;

        // integrantes de personal endpoints
        this.save_integrante_personal = `${domain}/${personal_res}/save`;
        this.search_integrantes_personal = `${domain}/${personal_res}/search`;

        // contabilidad endpoints
        this.get_cuentas = `${domain}/${contabilidad_res}/cuentas`;
        this.get_libro_mayor = `${domain}/${contabilidad_res}/libro-mayor`;
        this.get_periodos = `${domain}/${contabilidad_res}/periodos`;
        this.search_transacciones_almacen = `${domain}/${contabilidad_res}/transacciones`;

        // master directives endpoints
        this.get_master_directives = `${domain}/api/master-directives`;
        this.update_master_directive = `${domain}/api/master-directives/update`;

        // organigrama endpoints
        const organigrama_res = 'organigrama';
        this.get_all_cargos = `${domain}/${organigrama_res}`;
        this.save_cargo_with_manual = `${domain}/${organigrama_res}/save_mfunciones`;
        this.save_changes_organigrama = `${domain}/${organigrama_res}/save_changes_organigrama`;

        // activos fijos endpoints
        const activos_fijos_res = 'api/activos-fijos';
        this.save_orden_compra_activo = `${domain}/${activos_fijos_res}/save_ocaf`;
        this.search_ordenes_compra_activo = `${domain}/${activos_fijos_res}/ocaf/search`;
        this.get_orden_compra_activo_by_id = `${domain}/${activos_fijos_res}/ocaf/{ordenCompraActivoId}`;
        this.cancel_orden_compra_activo = `${domain}/${activos_fijos_res}/ocaf/{ordenCompraActivoId}/cancel`;
        this.get_items_by_orden_compra_activo_id = `${domain}/${activos_fijos_res}/ocaf/{ordenCompraActivoId}/items`;
        this.update_orden_compra_activo = `${domain}/${activos_fijos_res}/ocaf/{ordenCompraActivoId}/update`;
        this.incorporar_activos_fijos = `${domain}/${activos_fijos_res}/incorporar`;
        this.get_activo_fijo = `${domain}/${activos_fijos_res}/{id}`;
        this.update_activo_fijo = `${domain}/${activos_fijos_res}/{id}`;
        this.search_activos_fijos = `${domain}/${activos_fijos_res}/search`;

        // notifications endpoint
        this.module_notifications = `${domain}/notificaciones/notifications4user`;

        // AreaProduccion endpoints
        this.crear_area_produccion = `${domain}/${area_produccion_res}/crear`;
        this.area_prod_search_by_name = `${domain}/${area_produccion_res}/search_by_name`;

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
