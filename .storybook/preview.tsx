import { createRemixStub } from '@remix-run/testing';
import type { Preview } from '@storybook/react';
import '@/root.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: '*',
          action: () => ({ redirect: '/' }),
          loader: () => ({ redirect: '/' }),
          Component: () => <Story />,
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default preview;
