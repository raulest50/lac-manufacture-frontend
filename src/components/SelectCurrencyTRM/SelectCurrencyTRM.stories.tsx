import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SelectCurrencyTrm } from './SelectCurrencyTRM';
import { ChakraProvider } from '@chakra-ui/react';

const meta: Meta<typeof SelectCurrencyTrm> = {
  title: 'Components/SelectCurrencyTrm',
  component: SelectCurrencyTrm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
          <Story />
        </div>
      </ChakraProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectCurrencyTrm>;

// Wrapper component to handle state
const SelectCurrencyTrmWithState = (args: any) => {
  const [isUSD, setIsUSD] = useState(args.initialIsUSD || false);
  const handleUsd2Cop = (value: number) => {
    console.log('TRM value:', value);
  };

  return (
    <SelectCurrencyTrm 
      currencyIsUSD={[isUSD, setIsUSD]} 
      useCurrentUsd2Cop={handleUsd2Cop} 
    />
  );
};

export const Default: Story = {
  render: () => <SelectCurrencyTrmWithState initialIsUSD={false} />,
};

export const WithUSD: Story = {
  render: () => <SelectCurrencyTrmWithState initialIsUSD={true} />,
};