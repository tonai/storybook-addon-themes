import React, { useEffect, useState } from 'react';
import addons from '@storybook/addons';

import { CHANGE } from '../constants';
import { ThemeConfig } from '../models';
import { getSelectedTheme } from '../shared';

import { getHtmlClasses, getTheme } from './shared';

interface Props {
  config: ThemeConfig;
}

const channel = addons.getChannel();

export const ThemeDecorator: React.FC<Props> = (props) => {
  const { children, config } = props;

  const [theme, setTheme] = useState<string>(() => {
    const lastValue = channel.last(CHANGE);
    return (lastValue && lastValue[0]) || getSelectedTheme(config.list);
  });

  useEffect(() => {
    channel.on(CHANGE, setTheme);
    return () => channel.removeListener(CHANGE, setTheme);
  }, [setTheme]);

  return (
    <div className={getHtmlClasses(getTheme(config, theme))}>
      {children}
    </div>
  );
}
