import { Theme, ThemeConfig } from '../models';

export function getTheme(config: ThemeConfig, name: string) {
  return config.list.find((theme: Theme) => theme.name === name);
}

export function getHtmlClasses(theme: Theme) {
  return theme
    ? theme.class instanceof Array
      ? theme.class.join(' ')
      : theme.class
    : undefined;
}
