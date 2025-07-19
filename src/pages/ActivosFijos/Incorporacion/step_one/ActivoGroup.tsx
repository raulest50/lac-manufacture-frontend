import {useState} from 'react';
import {Card, CardBody, CardHeader, Flex} from '@chakra-ui/react';
import {Activo} from "../../types.tsx";

type Props = {
    activoPreliminar: Activo;
    cantidad: number;
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
export function ActivoGroup({activoPreliminar, cantidad}: Props) {

    const [activos, setActivos] = useState<Activo[]>([]);

    return (
        <Flex>
            <Card>
                <CardHeader bg={"blue.500"}>

                </CardHeader>

                <CardBody>
                </CardBody>

            </Card>


        </Flex>
    );
}
