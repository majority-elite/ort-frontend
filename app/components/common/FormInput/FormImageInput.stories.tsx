import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import FormInput from './FormInput';

const meta: Meta<typeof FormInput.Image> = {
  component: FormInput.Image,
};

export default meta;

type Story = StoryObj<typeof FormInput.Image>;

export const Main: Story = {
  args: {
    isError: false,
    multiple: false,
    onImageChange: fn(),
  },
};
