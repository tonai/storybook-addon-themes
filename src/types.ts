/** A named CSS theme. `none` is reserved for clearing the selection. */
export interface Theme {
  name: string;
  class?: string | string[];
  color?: string;
  /** @deprecated Prefer themes.default. */
  default?: boolean;
}
export interface ThemeConfig {
  list: Theme[];
  default?: string;
  clearable?: boolean;
  disable?: boolean;
  /** CSS selector; `root` is an alias for the document element. */
  target?: string;
  /** Runs in the preview on selection changes. May return a cleanup function. */
  onChange?: (theme: Theme | undefined) => void | (() => void);
}
export type ThemesParameter = Partial<ThemeConfig> | Theme[];
