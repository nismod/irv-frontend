import type { Meta, StoryObj } from '@storybook/react';

import { ColorBox } from './ColorBox';

const meta: Meta<typeof ColorBox> = {
  component: ColorBox,
};

export default meta;
type Story = StoryObj<typeof ColorBox>;

export const Red: Story = {
  render: () => <ColorBox color="red" />,
};
