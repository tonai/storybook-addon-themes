import { Decorator } from './Decorator';
import { Theme } from './Theme';

export interface ThemeConfig {
  Decorator?: Decorator,
  list: Theme[],
  attribute: string,
}
