// DatePicker.tsx
import React from 'react';
import { Input, FormControl, FormLabel } from '@chakra-ui/react';

interface DatePickerProps {
    date: string;
    setDate: (date: string) => void;
    defaultDate: string;
    label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    date,
    setDate,
    defaultDate,
    label,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleBlur = () => {
        // If date is empty, set to default date
        if (!date) {
            setDate(defaultDate);
        }
    };

    return (
        <FormControl>
            {label && <FormLabel>{label}</FormLabel>}
            <Input
                type="date"
                value={date}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormControl>
    );
};

export default DatePicker;
