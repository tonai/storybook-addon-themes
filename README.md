# Storybook Addon Backgrounds

Greatly inspired by [@storybook/addon-backgrounds](https://github.com/storybooks/storybook/tree/next/addons/backgrounds).

This Storybook Theme Decorator can be used to add a custom HTML class to the the preview in [Storybook](https://storybook.js.org).

## Compatibility

This version is compatible with storybook version `4.x.x`.

## Installation

```sh
npm i -D storybook-addon-themes
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import 'storybook-addon-themes/register';
```

## Usage

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withThemes } from 'storybook-addon-themes';

storiesOf('Button', module)
  .addDecorator(
    withThemes([
      { name: "twitter", class: "theme-twt", color: "#00aced", default: true },
      { name: "facebook", class: "theme-fb", color: "#3b5998" },
    ])
  )
  .add('with text', () => <button>Click me</button>);
```

You can add the themes to all stories with `addDecorator` in `.storybook/config.js`:

```js
import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { withThemes } from 'storybook-addon-themes';

addDecorator(
  withThemes([
        { name: "twitter", class: "theme-twt", color: "#00aced", default: true },
        { name: "facebook", class: "theme-fb", color: "#3b5998" },
      ])
);
```

If you want to override themes for a single story or group of stories, pass the `themes` parameter:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .addParameters({
    themes: [
      { name: "twitter", class: "theme-twt", color: "#00aced", default: true },
      { name: "facebook", class: "theme-fb", color: "#3b5998" },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

If you don't want to use themes for a story, you can set the `themes` parameter to `[]`, or use `{ disable: true }` to skip the addon:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module).add('with text', () => <button>Click me</button>, {
  themes: { disable: true },
});
```

You can choose your themes in a running storybook instance with the `theme` query param and either set the theme class, color or the name as the parameter value. E.g. `?theme=twitter`, `?theme=theme-twt` or `?theme=#00aced`.