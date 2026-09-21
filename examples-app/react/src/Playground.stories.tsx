import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = {
  title: 'Themes/Playground',
  render: () => (
    <section className="sample-card">
      <h1>Theme playground</h1>
      <button>Example button</button>
    </section>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const DarkDefault: Story = {
  parameters: { themes: { default: 'dark' } },
};
export const Disabled: Story = { parameters: { themes: { disable: true } } };
export const NonClearable: Story = {
  parameters: { themes: { clearable: false } },
};
export const RootTarget: Story = { parameters: { themes: { target: 'root' } } };
export const CustomTarget: Story = {
  parameters: { themes: { target: '.sample-card' } },
};
export const FixedTheme: Story = { globals: { theme: 'dark' } };
export const DifferentList: Story = {
  parameters: {
    themes: {
      default: 'ocean',
      list: [{ name: 'ocean', class: 'theme-ocean', color: '#0369a1' }],
    },
  },
};
export const Callback: Story = {
  parameters: {
    themes: {
      onChange: (theme: { name: string } | undefined) => {
        document.body.dataset.selectedTheme = theme?.name ?? 'none';
        return () => {
          delete document.body.dataset.selectedTheme;
        };
      },
    },
  },
};
