import addons, { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';

import { DECORATOR } from './constants';
import { Theme, ThemeConfig } from './models';
import parameters from './parameters';
import { getConfig } from './shared';

import { ThemeDecorator } from './decorators/angular';

function getModuleMetadata(metadata: any) {
  const { moduleMetadata, component } = metadata;

  if (component && !moduleMetadata) {
    return {
      declarations: [component, ThemeDecorator],
    };
  }

  if (component && moduleMetadata) {
    return {
      ...moduleMetadata,
      declarations: [...moduleMetadata.declarations, component, ThemeDecorator],
    };
  }

  return moduleMetadata;
}

function wrapper(getStory: StoryGetter, context: StoryContext, { parameters }: WrapperSettings) {
  const config = getConfig(parameters as ThemeConfig | Theme[]);
  const channel = addons.getChannel();
  channel.emit(DECORATOR);

  const metadata = getStory(context);
  return {
    ...metadata,
    component: ThemeDecorator,
    moduleMetadata: getModuleMetadata(metadata),
    props: {
      config,
      ...metadata.props,
    }
  };
}

export const withThemes = makeDecorator({ ...parameters, wrapper });

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
