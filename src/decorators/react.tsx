import React, { useEffect, useState } from 'react';
import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { Store } from '../store';
import { ThemeConfig } from '../models';
import { getSelectedTheme } from '../shared';

interface Props {
  config: ThemeConfig;
  store: Store;
}

export const ThemeDecorator: React.FC<Props> = (props) => {
  const { children, config, store } = props;

  const [storeTheme, setTheme] = useState<string>(store.get('theme'));
  const themeName = storeTheme || getSelectedTheme(config.list);
  const theme = config.list.find(theme => theme.name === themeName)
  
  useEffect(() => {
    return store.subscribe((key: any, value: string) => {
      if (key === 'theme') {
        setTheme(value);
      }
    });
  }, []);

  useEffect(() => {
    const updateStore = (theme: string) => store.set('theme', theme);
    const channel = addons.getChannel();
    channel.on(CHANGE, updateStore);
    return () => channel.removeListener(CHANGE, updateStore);
  }, [store]);

  useEffect(() => {
    const channel = addons.getChannel();
    channel.emit(THEME, themeName);
  }, [themeName]);

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
