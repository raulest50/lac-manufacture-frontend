

class serverParams{
    
    //static ip:string = "149.50.134.203";
    //static domain_name:string ="https://lac-manufacture-backend.onrender.com"; // FOR PRODUCTION
    static domain_name:string ="http://localhost:8080"; // FOR DEVELOPMENT
    //static spring_port:string ="8080";
    static productos_api:string = "productos";
    static endPoint_getall:string = "getall";
    static endPoint_save:string = "save";
    static endPoint_search_mp = "search_mprima";
    static endPoint_search_semi = "search_semi";
    static endPoint_search_termi = "search_terminado";

    static getProductoEndPoint_getall(): string{
        //return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_getall}`;
        //console.log(`${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_getall}`)
        return `${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_getall}`;
    }
    
    static getProductoEndPoint_save(): string{
        //return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_save}`;
        //console.log(`${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_save}`)
        return `${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_save}`;
    }

    static getMateriaPrimaEndPoint_search(): string{
        return `${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_search_mp}`;
    }

    static getSemiTerminadoEndPoint_search(): string{
        return `${serverParams.domain_name}/${serverParams.productos_api}/${serverParams.endPoint_search_semi}`;
    }

}

export {serverParams};
