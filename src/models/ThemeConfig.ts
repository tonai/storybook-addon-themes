import { Decorator } from './Decorator';
import { Theme } from './Theme';

export interface ThemeConfig {
  clearable?: boolean,
  Decorator?: Decorator,
  list: Theme[],
  onChange?: (themeName: Theme) => void
}
