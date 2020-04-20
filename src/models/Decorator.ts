import { ComponentType } from 'react';

import { Theme } from './Theme';

export interface DecoratorProps {
  attribute: string,
  theme: Theme
  themes: Theme[]
  themeClasses: string,
  themeValue: string,
  themeName: string
}

export type Decorator = ComponentType<DecoratorProps>;
