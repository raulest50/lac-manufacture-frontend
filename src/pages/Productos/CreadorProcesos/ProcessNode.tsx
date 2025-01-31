import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

type ProcessNodeProps = {
    id: string;
    data: {
        label: string;
        inputs: number;
        outputs: number;
        incrementInputs: (id: string) => void;
        decrementInputs: (id: string) => void;
        incrementOutputs: (id: string) => void;
        decrementOutputs: (id: string) => void;
    };
};

function ProcessNode({ id, data }: ProcessNodeProps) {
    const {
        label,
        inputs,
        outputs,
        incrementInputs,
        decrementInputs,
        incrementOutputs,
        decrementOutputs,
    } = data;

    return (
        <div style={{
            border: '1px solid #999',
            padding: '10px',
            borderRadius: '5px',
            background: 'white'
        }}>
            <strong>{label}</strong>
            <div style={{ marginTop: '6px' }}>
                <div>
                    <span>Inputs: {inputs} </span>
                    <button onClick={() => incrementInputs(id)}>+</button>
                    <button onClick={() => decrementInputs(id)}>-</button>
                </div>
                <div>
                    <span>Outputs: {outputs} </span>
                    <button onClick={() => incrementOutputs(id)}>+</button>
                    <button onClick={() => decrementOutputs(id)}>-</button>
                </div>
            </div>

            {/* Renders one target handle for each input */}
            {[...Array(inputs)].map((_, i) => (
                <Handle
                    key={`input_${i}`}
                    type="target"
                    position={Position.Left}
                    id={`input_${i}`}
                    style={{ top: 20 + i * 20 }}
                />
            ))}

            {/* Renders one source handle for each output */}
            {[...Array(outputs)].map((_, i) => (
                <Handle
                    key={`output_${i}`}
                    type="source"
                    position={Position.Right}
                    id={`output_${i}`}
                    style={{ top: 20 + i * 20 }}
                />
            ))}
        </div>
    );
}

export default memo(ProcessNode);
