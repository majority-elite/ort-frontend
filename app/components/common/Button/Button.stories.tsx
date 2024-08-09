import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Main: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: '버튼 텍스트',
    disabled: false,
    onClick: fn(),
  },
};
