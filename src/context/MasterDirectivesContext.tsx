import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import axios from "axios";
import EndPointsURL from "../api/EndPointsURL";

interface MasterDirective {
    nombre: string;
    valor: string;
    tipoDato: "TEXTO" | "NUMERO" | "DECIMAL" | "BOOLEANO" | "FECHA" | "JSON";
}

interface DTOAllMasterDirectives {
    masterDirectives: MasterDirective[];
}

type MasterDirectivesMap = Record<string, unknown>;

const MasterDirectivesContext = createContext<MasterDirectivesMap>({});

export function MasterDirectivesProvider({ children }: { children: ReactNode }) {
    const [directives, setDirectives] = useState<MasterDirectivesMap>({});
    const endPoints = useMemo(() => new EndPointsURL(), []);

    useEffect(() => {
        const fetchDirectives = async () => {
            try {
                const res = await axios.get<DTOAllMasterDirectives>(endPoints.get_master_directives);
                const map: MasterDirectivesMap = {};
                res.data.masterDirectives.forEach(md => {
                    let value: unknown = md.valor;
                    switch (md.tipoDato) {
                        case "BOOLEANO":
                            value = md.valor === "true";
                            break;
                        case "NUMERO":
                            value = parseInt(md.valor, 10);
                            break;
                        case "DECIMAL":
                            value = parseFloat(md.valor);
                            break;
                        case "JSON":
                            try {
                                value = JSON.parse(md.valor);
                            } catch {
                                value = md.valor;
                            }
                            break;
                        default:
                            value = md.valor;
                    }
                    map[md.nombre] = value;
                });
                setDirectives(map);
            } catch (error) {
                console.error("Error fetching master directives", error);
            }
        };
        fetchDirectives();
    }, [endPoints]);

    return (
        <MasterDirectivesContext.Provider value={directives}>
            {children}
        </MasterDirectivesContext.Provider>
    );
}

export function useMasterDirectives() {
    return useContext(MasterDirectivesContext);
}

