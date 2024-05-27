

class serverParams{
    
    static ip:string = "149.50.134.203";
    static domain_name:string ="http://vps-4126991-x.dattaweb.com";
    static spring_port:string ="8080";
    static productos_api:string = "productos";
    static endPoint_getall:string = "getall";
    static endPoint_save:string = "save";
    
    static getProductoEndPoint_getall(): string{
        return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_getall}`;
    }
    
    static getProductoEndPoint_save(): string{
        return `${serverParams.domain_name}:${serverParams.spring_port}/${serverParams.productos_api}/${serverParams.endPoint_save}`;
    }
        
}

export {serverParams};
