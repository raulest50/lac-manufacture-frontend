// DatePicker.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { parse, isValid, format } from 'date-fns';

interface DatePickerProps {
    date: string;
    setDate: (date: string) => void;
    defaultDate: string;
    label?: string;
    placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   date,
                                                   setDate,
                                                   defaultDate,
                                                   label,
                                                   placeholder = 'YYYY-MM-DD',
                                               }) => {
    const [inputValue, setInputValue] = useState<string>(date);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setInputValue(date);
    }, [date]);

    const handleBlur = () => {
        if (isValidDate(inputValue)) {
            setDate(inputValue);
            setIsError(false);
        } else {
            setDate(defaultDate);
            setInputValue(defaultDate);
            setIsError(true);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsError(false);
    };

    const isValidDate = (dateString: string): boolean => {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        return isValid(parsedDate) && dateString === format(parsedDate, 'yyyy-MM-dd');
    };

    return (
        <FormControl isInvalid={isError}>
            {label && <FormLabel>{label}</FormLabel>}
            <Input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
            />
            {isError && (
                <FormErrorMessage>Invalid date format. Reverted to default date.</FormErrorMessage>
            )}
        </FormControl>
    );
};

export default DatePicker;
