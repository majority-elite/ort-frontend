import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import FormItem from './FormItem';

const meta: Meta<typeof FormItem.Text> = {
  component: FormItem.Text,
  decorators: [
    function Decorator(Story, ctx) {
      const [value, setValue] = useState('');

      return (
        <Story
          args={{
            ...ctx.args,
            value,
            onTextChange: (newText) => {
              action('onTextChange')(newText);
              setValue(newText);
            },
          }}
        />
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof FormItem.Text>;

export const Main: Story = {
  args: {
    label: '이름',
    optional: false,
    placeholder: '텍스트를 입력해주세요.',
    errorMessage: '',
    caption: '',
  },
};
