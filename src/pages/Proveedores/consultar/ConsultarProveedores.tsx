import {useState} from "react";
import PanelBusqueda from "./panel_busqueda_comp/PanelBusqueda.tsx";
import {DetalleProveedor} from "./DetalleProveedor.tsx";
import {Proveedor} from "../types.tsx";

export function ConsultarProveedores() {

    const [estado, setEstado] = useState(0);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor>();

    function ConditionalRender(){
        if(estado === 0){
            return(
                <PanelBusqueda
                    setEstado={setEstado}
                    setProveedorSeleccionado={setProveedorSeleccionado}
                />
            );
        }
        if(estado === 1){
            return(
                <DetalleProveedor
                    proveedor={proveedorSeleccionado!}
                    setEstado={setEstado}
                    setProveedorSeleccionado={setProveedorSeleccionado}
                    refreshSearch={() => {
                        // Forzar un re-render del componente PanelBusqueda
                        // al cambiar el estado
                        setEstado(0);
                    }}
                />
            );
        }
    }

    return (
        <ConditionalRender />
    );
}
