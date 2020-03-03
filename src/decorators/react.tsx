import React, { useEffect, useState } from 'react';
import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { Store } from '../store';
import { ThemeConfig } from '../models';
import { getSelectedTheme } from '../shared';
import { getHtmlClasses, getTheme } from './shared';

interface Props {
  config: ThemeConfig;
  store: Store;
  ThemeProvider?: any,
}

export const ThemeDecorator: React.FC<Props> = (props) => {
  const { children, config, store, ThemeProvider } = props;
  const channel = addons.getChannel();

  const [storeTheme, setTheme] = useState<string>(store.get('theme'));
  const themeName = storeTheme || getSelectedTheme(config.list);

  useEffect(() => {
    return store.subscribe((key: any, value: string) => {
      if (key === 'theme') {
        setTheme(value);
      }
    });
  }, []);

  useEffect(() => {
    const updateStore = (theme: string) => {
      store.set('theme', theme);
    }

    channel.on(CHANGE, updateStore);
    return () => channel.removeListener(CHANGE, updateStore);
  }, [store]);

  useEffect(() => {
    channel.emit(THEME, themeName);
  }, [themeName]);

  return ThemeProvider
    ? <ThemeProvider theme={{ name: themeName }}>
          {children}
      </ThemeProvider>
    : <div className={getHtmlClasses(getTheme(config, themeName))}>
        {children}
      </div>
}
