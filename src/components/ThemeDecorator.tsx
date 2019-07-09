import React, { useEffect } from 'react';
import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { useTheme } from '../hooks';
import { Store } from '../store';
import { ThemeConfig } from '../models';
import { getSelectedTheme } from '../shared';

interface Props {
  config: ThemeConfig;
  store: Store;
}

export const ThemeDecorator: React.FC<Props> = (props) => {
  const { children, config, store } = props;
  const themeName = useTheme(store) || getSelectedTheme(config.list);
  const theme = config.list.find(theme => theme.name === themeName)
  const channel = addons.getChannel();
  
  channel.emit(THEME, themeName);

  useEffect(() => {
    const callback = (theme: string) => store.set('theme', theme);
    const channel = addons.getChannel();
    channel.on(CHANGE, callback);
    return () => channel.removeListener(CHANGE, callback);
  }, [store]);

  const themeClasses = theme
      ? theme.class instanceof Array
        ? theme.class.join(' ')
        : theme.class
      : undefined;

  return (
    <div className={themeClasses}>
      {children}
    </div>
  );
}
