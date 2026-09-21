import type { Preview } from '@storybook/angular';
import { themes } from '../../shared/themes';
const preview: Preview = {
  parameters: { themes, docs: { story: { inline: false } } },
  tags: ['autodocs'],
};
export default preview;
