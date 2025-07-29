import { useState } from 'react';
import PanelBusqueda from './PanelBusqueda.tsx';
import { DetalleCliente } from './DetalleCliente.tsx';
import { Cliente } from '../types.tsx';

export function ConsultarClientes(){
    const [estado,setEstado]=useState(0); //0 lista,1 detalle
    const [clienteSeleccionado,setClienteSeleccionado]=useState<Cliente>();

    const Conditional=()=>{
        if(estado===0){
            return <PanelBusqueda setEstado={setEstado} setClienteSeleccionado={setClienteSeleccionado}/>;
        }
        if(estado===1 && clienteSeleccionado){
            return <DetalleCliente cliente={clienteSeleccionado} setEstado={setEstado} setClienteSeleccionado={setClienteSeleccionado} refreshSearch={()=>setEstado(0)} />;
        }
    };

    return <Conditional/>;
}
