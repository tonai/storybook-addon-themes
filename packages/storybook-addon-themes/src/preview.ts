import { useEffect } from 'storybook/preview-api';
import type {
  DecoratorFunction,
  ProjectAnnotations,
  Renderer,
} from 'storybook/internal/types';
import { getConfig, getSelectedTheme, getThemeClasses } from './config';
import { GLOBAL_KEY } from './constants';
import { observeTheme } from './dom';

export const withThemes: DecoratorFunction = (story, context) => {
  const config = getConfig(context.parameters.themes);
  const theme = getSelectedTheme(config, context.globals[GLOBAL_KEY]);
  const classes = getThemeClasses(theme).join(' ');
  useEffect(() => {
    if (config.disable) return;
    try {
      return observeTheme(document, config.target ?? 'body', theme);
    } catch (error) {
      console.warn(
        '[storybook-addon-themes] Invalid target selector:',
        config.target,
        error,
      );
    }
  }, [config.disable, config.target, classes, context.id]);
  useEffect(() => {
    if (!config.disable) return config.onChange?.(theme);
  }, [config.disable, config.onChange, theme, context.id]);
  return story();
};

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withThemes],
  initialGlobals: { [GLOBAL_KEY]: undefined },
};
export default preview;
