import { useState } from 'react';
import {
  Flex, 
  Card, 
  CardHeader,
} from '@chakra-ui/react';
import { IncorporacionActivoDta, OrdenCompraActivo } from "../types.tsx";
import {TipoIngresoSelection} from "./TipoIngresoSelection.tsx";
import {TIPO_INCORPORACION} from "../types.tsx";

type Props = {
    setActiveStep: (step: number) => void;
    setOrdenCompraActivo: (ordenCompraActivo: OrdenCompraActivo) => void;
    setIncorporacionActivoHeader: (incorporacionActivoHeader: IncorporacionActivoDta) => void;
};

/**
 *
 * se debe seleccionar el tipo de incorporacion, si es con OC o sin OC,
 * o si se trata de un activo fijo existente.
 * en caso de seringreso por OC se debe digitar el id de la OC-AF.
 *
 * @param setStep
 * @constructor
 */
export function StepZeroTipoIngreso({
                                        setActiveStep,
                                        setOrdenCompraActivo,
                                        setIncorporacionActivoHeader }: Props) {

  const VIEW_MODES = {SEL_TFI:0, IDENT_OC:1};
  const [viewMode, setViewMode] = useState<number>(VIEW_MODES.SEL_TFI);


    /**
     * responsable de usar el tipo de incorporacion seleccionado
     * en el componente TipoIngresoSelection y actualizar los
     * valores correspondientes para pasar al siguiente step.
     * @param tipo_incorporacion
     */
  const setTipoIncorporacion =
      (tipo_incorporacion: string):void => {
    if(tipo_incorporacion === TIPO_INCORPORACION.CON_OC){
        setViewMode(VIEW_MODES.IDENT_OC);
    }

    if(tipo_incorporacion === TIPO_INCORPORACION.SIN_OC){
        setActiveStep(1);
    }

    if(tipo_incorporacion === TIPO_INCORPORACION.AF_EXISTENTE){
        setActiveStep(1);
    }

  }

  const ConditionalRender = () => {
    if(viewMode === VIEW_MODES.SEL_TFI){
      return(
          <TipoIngresoSelection setTipoIncorporacion={setTipoIncorporacion}/>
      );
    }
    if(viewMode === VIEW_MODES.IDENT_OC){
      return(
          <Card>
              <CardHeader bg={"blue.500"}>buscar OC-AF por ID</CardHeader>
          </Card>
      )
    }
  }

  return (
    <Flex direction="column" gap={10} w="full">
      <ConditionalRender />
    </Flex>
  );
}
