// components/LoadingError.tsx

import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

interface LoadingErrorProps {
    loading: boolean;
    error: string | null;
}

const MyLoading: React.FC<LoadingErrorProps> = ({ loading, error }) => {
    if (!loading && !error) {
        return null; // If there's nothing to display, render nothing
    }

    return (
        <>
            {loading && (
                <Flex justifyContent="center" alignItems="center" my={4}>
                    <Spinner size="xl" />
                    <Text ml={2}>Cargando...</Text>
                </Flex>
            )}
            {error && (
                <Text color="red.500" mb={4}>
                    {error}
                </Text>
            )}
        </>
    );
};

export default MyLoading;
