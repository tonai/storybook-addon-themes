import React, {useEffect, useState} from 'react';
import addons from '@storybook/addons';

import {CHANGE, THEME} from '../constants';
import {Store} from '../store';
import {Decorator, ThemeConfig} from '../models';
import {getSelectedTheme, getSelectedThemeName} from '../shared';

import {getHtmlClasses} from './shared';

interface Props {
  config: ThemeConfig;
  store: Store;
}

export const ThemeDecorator: React.FC<Props> = (props) => {
  const {children, config, store} = props;
  const {Decorator, list, attribute} = config;
  const channel = addons.getChannel();

  const [storeTheme, setTheme] = useState<string>(store.get('theme'));
  const themeName = storeTheme || getSelectedThemeName(list);
  const theme = getSelectedTheme(list, themeName);

  const decoratorProps: any = {
    attribute
  };

  if (attribute === 'class') {
    decoratorProps['themeClasses'] = getHtmlClasses(theme);
  } else {
    decoratorProps['themeValue'] = theme.value;
  }

  useEffect(() => {
    return store.subscribe((key: any, value: string) => {
      if (key === 'theme') {
        setTheme(value);
      }
    });
  }, []);

  useEffect(() => {
    const updateStore = (theme: string) => store.set('theme', theme);
    channel.on(CHANGE, updateStore);
    return () => channel.removeListener(CHANGE, updateStore);
  }, [store]);

  useEffect(() => {
    channel.emit(THEME, themeName);
  }, [themeName]);

  if (Decorator) {
    return (
      <Decorator theme={theme} themes={list} {...decoratorProps} themeName={themeName}>
        {children}
      </Decorator>
    );
  }

  const componentProps: { className?: string, [key: string]: string } = {};
  if (attribute === 'class') {
    componentProps['className'] = decoratorProps['themeClasses']
  } else {
    componentProps[attribute] = decoratorProps['themeValue'];
  }

  return (
    <div {...componentProps}>
      {children}
    </div>
  );
}
