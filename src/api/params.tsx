

class ServerParams {

    // PRODUCTOS
    static productos_api:string = "productos";

    static endPoint_getall:string = "getall";
    static endPoint_save:string = "save";
    static endPoint_search_mp = "search_mprima";
    static endPoint_search_semi = "search_semi";
    static endPoint_getall_termi = "getall_termi";


    // MOVIMIENTOS
    static movimientos_api:string = "movimientos";
    static movstock_by_id = "get_stock_by_id";

    // ORDENES PRODUCCION
    static produccion_api = "produccion";
    static endPoint_get_by_estado = "get_by_estado";
    static endPoint_get_by_zona = "get_workload";
    static endPoint_get_orden_prod_by_zona= "get_orden_prod_by_zona";
    static endPoint_Update_OrdSeg_Estado = "update_oseg_estado";


    // - - - - - - - - - - - - - - - - - - -



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


    /**
     * PRODUCTOS END POINTS
     */
    static getProductoEndPoint_TerminadosGetAll(): string{
        return `${ServerParams.getDomain()}/${ServerParams.productos_api}/${ServerParams.endPoint_getall_termi}`;
    }

    static getProductoEndPoint_getall(): string{
        //return `${serverParams.getDomain()}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_getall}`;
        //console.log(`${serverParams.getDomain()}/${serverParams.productos_api}/${serverParams.endPoint_getall}`)
        return `${ServerParams.getDomain()}/${ServerParams.productos_api}/${ServerParams.endPoint_getall}`;
    }
    
    static getProductoEndPoint_save(): string{
        //return `${serverParams.getDomain()}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_save}`;
        //console.log(`${serverParams.getDomain()}/${serverParams.productos_api}/${serverParams.endPoint_save}`)
        return `${ServerParams.getDomain()}/${ServerParams.productos_api}/${ServerParams.endPoint_save}`;
    }

    static getMateriaPrimaEndPoint_search(): string{
        return `${ServerParams.getDomain()}/${ServerParams.productos_api}/${ServerParams.endPoint_search_mp}`;
    }

    static getSemiTerminadoEndPoint_search(): string{
        return `${ServerParams.getDomain()}/${ServerParams.productos_api}/${ServerParams.endPoint_search_semi}`;
    }


    /**
     * MOVIMIENTOS END POINTS
     */
     static getMovimientoEndPoint_save(): string {
         return `${ServerParams.getDomain()}/${ServerParams.movimientos_api}/${ServerParams.endPoint_save}`;
    }

    static getMovStockEndPoint_byId():string{
        return `${ServerParams.getDomain()}/${ServerParams.movimientos_api}/${ServerParams.movstock_by_id}`;
    }


    /**
     * PRODUCCION END POINTS
     */
    static getProduccionEndPoint_save(): string{
        return `${ServerParams.getDomain()}/${ServerParams.produccion_api}/${ServerParams.endPoint_save}`;
    }

    static getProduccionEndPoint_byEstado(): string{
        return `${ServerParams.getDomain()}/${ServerParams.produccion_api}/${ServerParams.endPoint_get_by_estado}`;
    }

    static getWorkload_by_zona(): string{
        return `${ServerParams.getDomain()}/${ServerParams.produccion_api}/${ServerParams.endPoint_get_by_zona}`;
    }

    static getOrdenesProd_by_zona(): string{
        return `${ServerParams.getDomain()}/${ServerParams.produccion_api}/${ServerParams.endPoint_get_orden_prod_by_zona}`;
    }

    static getProduccionEndPoint_Update_OrdSeg_Estado(): string{
        return `${ServerParams.getDomain()}/${ServerParams.produccion_api}/${ServerParams.endPoint_Update_OrdSeg_Estado}`;
    }


    static getSearchProductsWithStockEndpoint() {
        return `${this.getDomain()}/movimientos/search_products_with_stock`;
    }

    static getMovimientosByProductoEndpoint() {
        return `${this.getDomain()}/movimientos/get_movimientos_by_producto`;
    }

}

export {ServerParams};
