import type { Meta } from '@storybook/react';
import ResizerWrapper from './ResizerWrapper';

const meta = {
  title: 'Example/Resizer',
  component: ResizerWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResizerWrapper>;

export default meta;

export const Rotate = {
  args: {},
};

