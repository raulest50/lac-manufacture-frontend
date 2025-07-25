import {Card, CardBody, CardHeader, Flex} from '@chakra-ui/react';
import {ActivoFijo, ItemOrdenCompraActivo} from "../../types.tsx";

type Props = {
    itemOrdenCompraActivo: ItemOrdenCompraActivo;
    setActivoFijoGroup: (activoFijoGroup: ActivoFijo[]) => void;
};

/**
 * cuando se hace una orden de compra de activos, es pósible que del mismo
 * activo se requiera varias unidades. sin embargo se debe registrar cada una
 * por separado a diferencia de como sucede con los materiales, ya que minimo
 * se debe establecer una identificacion, un lugar y un responsable para cada
 * activo a pesar que sea el mismo.
 * @param props
 * @constructor
 */
export function ActivoGroup({}: Props) {

    return (
        <Flex>
            <Card
                boxShadow='lg'
            >
                <CardHeader bg={"blue.200"}>

                </CardHeader>
                <CardBody>
                </CardBody>
            </Card>
        </Flex>
    );
}
