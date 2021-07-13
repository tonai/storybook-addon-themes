import { Decorator } from './Decorator';
import { Theme } from './Theme';

export interface ThemeConfig {
  icon?: string,
  clearable?: boolean,
  Decorator?: Decorator,
  default?: string,
  list: Theme[],
  onChange?: (themeName: Theme) => void,
  target?: string
}
