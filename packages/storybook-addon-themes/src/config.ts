import { NONE } from './constants';
import type { Theme, ThemeConfig, ThemesParameter } from './types';

export function getConfig(parameter?: ThemesParameter): ThemeConfig {
  const config = Array.isArray(parameter) ? { list: parameter } : parameter;
  return {
    clearable: true,
    target: 'body',
    ...config,
    list: config?.list ?? [],
  };
}

/** Resolve stale URL globals safely when navigating between different theme lists. */
export function getSelectedTheme(
  config: ThemeConfig,
  selection: unknown,
): Theme | undefined {
  if (config.disable) return undefined;
  if (selection === NONE && config.clearable !== false) return undefined;
  return (
    config.list.find((theme) => theme.name === selection) ??
    config.list.find((theme) => theme.name === config.default) ??
    config.list.find((theme) => theme.default) ??
    (config.clearable === false ? config.list[0] : undefined)
  );
}

export function getThemeClasses(theme?: Theme): string[] {
  const value = theme?.class;
  return [
    ...new Set(
      (Array.isArray(value) ? value.join(' ') : (value ?? ''))
        .split(/\s+/)
        .filter(Boolean),
    ),
  ];
}
