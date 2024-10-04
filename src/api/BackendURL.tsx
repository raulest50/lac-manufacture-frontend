

class BackendURL{

    domain: string;

    res_productos: string;
    res_produccion: string;

    ep_mp_pendientes: string; // end point materias primas pendientes de completar info (recien codificadas de HyL)
    ep_update_mp: string // end point para guardar - hacer update de materia prima
    ep_getall_mp: string;
    ep_getall_st: string;

    constructor() {
        this.domain = this.getDomain();

        this.res_productos = "productos";
        this.res_produccion = "produccion";

        this.ep_mp_pendientes = `${this.domain}/${this.res_productos}/get_mp_pendientes`;
        this.ep_update_mp = `${this.domain}/${this.res_productos}/save_mp`;
        this.ep_getall_mp = `${this.domain}/${this.res_productos}/getall_mp`;
        this.ep_getall_st = `${this.domain}/${this.res_productos}/getall_st`;


    }

    // Method to return the correct domain name
    getDomain(): string {
        console.log(window.location.hostname);
        // Check if running on localhost
        if (window.location.hostname === "localhost") {
            return "http://localhost:8080"
        } else {
            return "https://lac-manufacture-backend.onrender.com";
        }
    }
}

export default BackendURL;
