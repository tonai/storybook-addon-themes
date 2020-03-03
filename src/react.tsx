import React from 'react';
import addons, { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';

import { DECORATOR } from './constants';
import { Theme, ThemeConfig, DecoratorConfiguration } from './models';
import parameters from './parameters';
import { Store } from './store';
import { getConfig } from './shared';

import { ThemeDecorator } from './decorators/react';

export const store = new Store();

const wrapper = (getStory: StoryGetter, context: StoryContext, { parameters }: WrapperSettings) => {
  const config = getConfig(parameters as ThemeConfig | Theme[]);
  const channel = addons.getChannel();
  channel.emit(DECORATOR);

  return (
    <ThemeDecorator config={config} store={store}>
      {getStory(context)}
    </ThemeDecorator>
  );
}

const wrapperCustomConfiguration = (configuration: DecoratorConfiguration = {}) => (getStory: StoryGetter, context: StoryContext, { parameters }: WrapperSettings) => {
  const config = getConfig(parameters as ThemeConfig | Theme[]);
  const channel = addons.getChannel();
  channel.emit(DECORATOR);

  return (
      <ThemeDecorator config={config} store={store} ThemeProvider={configuration.themeProvider}>
        {getStory(context)}
      </ThemeDecorator>
  );
}

export const withThemes = (configuration : DecoratorConfiguration) => makeDecorator({ ...parameters, wrapper });
export const withThemesCustomConfiguration = (configuration : DecoratorConfiguration) => makeDecorator({ ...parameters, wrapper: wrapperCustomConfiguration(configuration)});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
