import {useState} from 'react';
import {Flex} from '@chakra-ui/react';

type Props = {
    prp: number;
};

export function ListaSearchProveedores({prp}: Props) {

    const [est, setEst] = useState(0);
    setEst(1);
    console.log(est, prp);

    return (
        <Flex>

        </Flex>
    );
}
