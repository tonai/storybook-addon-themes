import type { Preview } from '@storybook/web-components-vite';
import { themes } from '../../shared/themes';
import '../../shared/themes.css';
const preview: Preview = {
  parameters: { themes, docs: { story: { inline: false } } },
  tags: ['autodocs'],
};
export default preview;
