import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import FormItem from './FormItem';

const meta: Meta<typeof FormItem.Image> = {
  component: FormItem.Image,
  decorators: [
    function Decorator(Story, ctx) {
      const [previewImageUrl, setPreviewImageUrl] = useState('');

      return (
        <Story
          args={{
            ...ctx.args,
            previewImageUrl,
            onImageChange: (imageUrl) => {
              action('onImageChange')(imageUrl);
              setPreviewImageUrl(imageUrl);
            },
          }}
        />
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof FormItem.Image>;

export const Main: Story = {
  args: {
    label: '이름',
    optional: false,
    errorMessage: '',
    caption: '',
  },
};
