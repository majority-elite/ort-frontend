import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import FormInput from './FormInput';

const meta: Meta<typeof FormInput.Image> = {
  component: FormInput.Image,
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

type Story = StoryObj<typeof FormInput.Image>;

export const Main: Story = {
  args: {
    isError: false,
  },
};
