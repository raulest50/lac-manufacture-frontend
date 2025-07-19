import React, {SetStateAction, useState} from 'react';
import axios from 'axios';
import {Flex, Select, Input} from '@chakra-ui/react';

type Props = {
    currencyIsUSD : [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    useCurrentUsd2Cop: (usd2cop:number) => void; 
};


export function SelectCurrencyTrm({
    currencyIsUSD,
    useCurrentUsd2Cop,}: Props) {
    
    const TIPO_TRM = {ARBITRARIA:'ARBITRARIA', FECHA:'FECHA', ACTUAL:'ACTUAL'};
    
    const [usd2copState, setUsd2copState] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [currency, setCurrency] = useState<string>(currencyIsUSD[0] ? 'USD' : 'COP');
    const [tipoTRM, setTipoTRM] = useState<string>(TIPO_TRM.ACTUAL);

    const fetchLatestTRM = async () => {
        try {
            const response = await axios.get('https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC');
            const trm = response.data[0].valor;
            setUsd2copState(trm);
            useCurrentUsd2Cop(Number(trm));
        } catch (error) {
            console.error('Error fetching TRM:', error);
        }
    };

    const fetchTRMbyDate = async () => {
        try {
            const response = await axios.get(`https://www.datos.gov.co/resource/32sa-8pi3.json?vigenciadesde=${date}`);
            if (response.data.length > 0) {
                const trm = response.data[0].valor;
                setUsd2copState(trm);
                useCurrentUsd2Cop(Number(trm));
            }
        } catch (error) {
            console.error('Error fetching TRM by date:', error);
        }
    }

    const ConditionalRender = () => {
        if(tipoTRM == TIPO_TRM.ACTUAL){
            return(
                <Flex>
                    <Input
                        value={usd2copState}
                        onChange={(e) => {
                            setUsd2copState(e.target.value);
                            useCurrentUsd2Cop(Number(e.target.value));
                        }}
                        onFocus={() => fetchLatestTRM()}
                    />
                </Flex>
            );
        }
        if(tipoTRM == TIPO_TRM.FECHA){
            return(
                <Flex>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        onBlur={() => fetchTRMbyDate()}
                    />
                    <Input
                        value={usd2copState}
                        onChange={(e) => {
                            setUsd2copState(e.target.value);
                            useCurrentUsd2Cop(Number(e.target.value));
                        }}
                    />
                </Flex>
            );
        }
        if(tipoTRM == TIPO_TRM.ARBITRARIA){
            return(
                <Flex>
                    <Input
                        value={usd2copState}
                        onChange={(e) => {
                            setUsd2copState(e.target.value);
                            useCurrentUsd2Cop(Number(e.target.value));
                        }}
                    />
                </Flex>
            );
        }
    }

    return (
        <Flex direction={"column"}>
            <Select
                value={currency}
                onChange={(e) => {
                    const cur = e.target.value;
                    setCurrency(cur);
                    cur == 'USD' ? currencyIsUSD[1](true) : currencyIsUSD[1](false);
                }}
            >
                <option value={'USD'} >USD</option>
                <option value={'COP'} >COP</option>
            </Select>

            <Flex
                direction={"row"}
                display={currencyIsUSD ? 'none' : 'flex'}
            >

                <Select
                    value={tipoTRM}
                    onChange={(e) => setTipoTRM(e.target.value)}
                >
                    <option value={TIPO_TRM.ACTUAL} >{TIPO_TRM.ACTUAL}</option>
                    <option value={TIPO_TRM.FECHA} >{TIPO_TRM.FECHA}</option>
                    <option value={TIPO_TRM.ARBITRARIA} >{TIPO_TRM.ARBITRARIA}</option>
                </Select>
                
                <ConditionalRender/>
                
            </Flex>

        </Flex>
    );
}
