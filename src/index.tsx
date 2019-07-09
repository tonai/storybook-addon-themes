import React from 'react';
import addons, { makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';

import { DECORATOR, PARAM_KEY } from './constants';
import { ThemeDecorator } from './components';
import { Store } from './store';
import { getConfig } from './shared';
import { Theme, ThemeConfig } from './models';

export const store = new Store();

export const withThemes = makeDecorator({
  name: 'withThemes',
  parameterName: PARAM_KEY,
  wrapper: (getStory: StoryGetter, context: StoryContext, { parameters }) => {
    const config = getConfig(parameters as ThemeConfig | Theme[]);
    const channel = addons.getChannel();
    channel.emit(DECORATOR);
    
    return (
      <ThemeDecorator config={config} store={store}>
        {getStory(context)}
      </ThemeDecorator>
    );
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
