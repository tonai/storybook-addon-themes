import addons, { makeDecorator } from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import Events from './constants';

let prevThemes;

const subscription = () => () => {
  prevThemes = null;
  addons.getChannel().emit(Events.UNSET);
};

export const withThemes = makeDecorator({
  name: 'withThemes',
  parameterName: 'themes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const data = parameters || options || [];
    const themes = Array.isArray(data) ? data : Object.values(data);

    if (themes.length === 0) {
      return getStory(context);
    }

    if (prevThemes !== themes) {
      addons.getChannel().emit(Events.SET, themes);
      prevThemes = themes;
    }
    addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);

    return getStory(context);
  },
});

export default deprecate(
  withThemes,
  'The default export of storybook-addon-themes is deprecated, please `import { withThemes }` instead'
);