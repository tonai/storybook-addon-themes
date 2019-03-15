import { makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import deprecate from 'util-deprecate';

// This decorator is kept purely so we produce a decorator that is compatible with both
// `addDecorator(withThemes(...))` and `addDecorator(withThemes)`
export const withThemes = deprecate(
  makeDecorator({
    name: 'withThemes',
    parameterName: 'Themes',
    wrapper: (getStory: StoryGetter, context: StoryContext) => {
      return getStory(context);
    },
  }),
  `Note that withThemes(options) has been replaced by addParameters({ Themes: options})`
);

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}