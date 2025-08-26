import StepOneComponent from './StepOneComponent';
import StepTwoComponent from './StepTwoComponent';
import {useState} from 'react';
import {DispensacionDirectaDetalleItem} from '../types';

export function AsistenteDispensacionDirecta(){
    const [viewMode, setViewMode] = useState(0);
    const [dispensacion, setDispensacion] = useState<DispensacionDirectaDetalleItem[]>([]);

    return viewMode === 0 ? (
        <StepOneComponent setViewMode={setViewMode} setDispensacion={setDispensacion} />
    ) : (
        <StepTwoComponent setViewMode={setViewMode} items={dispensacion} setItems={setDispensacion} />
    );
}

