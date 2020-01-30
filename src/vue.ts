import addons, { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';

import { DECORATOR } from './constants';
import { Theme, ThemeConfig } from './models';
import parameters from './parameters';
import { Store } from './store';
import { getConfig } from './shared';

import { ThemeDecorator } from './decorators/vue';

export const store = new Store();

function wrapper(getStory: StoryGetter, context: StoryContext, { parameters }: WrapperSettings) {
  const config = getConfig(parameters as ThemeConfig | Theme[]);
  const channel = addons.getChannel();
  channel.emit(DECORATOR);

  return {
    components: { ThemeDecorator },
    template: `
<theme-decorator :config="config" :store="store">
  <story/>
</theme-decorator>`,
    data() {
      return { config, store };
    },
  }
}

export const withThemes = makeDecorator({ ...parameters, wrapper});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
