

class ServerParams {
    
    //static ip:string = "149.50.134.203";
    //static domain_name:string ="https://lac-manufacture-backend.onrender.com"; // FOR PRODUCTION
    static domain_name:string ="http://localhost:8080"; // FOR DEVELOPMENT
    //static spring_port:string ="8080";

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

    /**
     * PRODUCTO END POINTS
     */


    static getProductoEndPoint_TerminadosGetAll(): string{
        return `${ServerParams.domain_name}/${ServerParams.productos_api}/${ServerParams.endPoint_getall_termi}`;
    }

    static getProductoEndPoint_getall(): string{
        //return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_getall}`;
        //console.log(`${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_getall}`)
        return `${ServerParams.domain_name}/${ServerParams.productos_api}/${ServerParams.endPoint_getall}`;
    }
    
    static getProductoEndPoint_save(): string{
        //return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_save}`;
        //console.log(`${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_save}`)
        return `${ServerParams.domain_name}/${ServerParams.productos_api}/${ServerParams.endPoint_save}`;
    }

    static getMateriaPrimaEndPoint_search(): string{
        return `${ServerParams.domain_name}/${ServerParams.productos_api}/${ServerParams.endPoint_search_mp}`;
    }

    static getSemiTerminadoEndPoint_search(): string{
        return `${ServerParams.domain_name}/${ServerParams.productos_api}/${ServerParams.endPoint_search_semi}`;
    }

    /**
     * MOVIMIENTOS END POINTS
     */
     static getMovimientoEndPoint_save(): string {
         return `${ServerParams.domain_name}/${ServerParams.movimientos_api}/${ServerParams.endPoint_save}`;
    }

    static getMovStockEndPoint_byId():string{
        return `${ServerParams.domain_name}/${ServerParams.movimientos_api}/${ServerParams.movstock_by_id}`;
    }

}

export {ServerParams};
