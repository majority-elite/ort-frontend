import type { Meta, StoryObj } from '@storybook/react';

import LoginModal from './LoginModal';

const meta: Meta<typeof LoginModal> = {
  component: LoginModal,
};

export default meta;

type Story = StoryObj<typeof LoginModal>;

export const Main: Story = {};
