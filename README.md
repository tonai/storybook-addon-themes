# Storybook Addon Themes

Greatly inspired by [@storybook/addon-backgrounds](https://github.com/storybooks/storybook/tree/next/addons/backgrounds).

This Storybook Theme Decorator can be used to add a custom HTML class or classes to the the preview in [Storybook](https://storybook.js.org).

## Compatibility

This version is compatible with storybook version `5.x.x`.

## Installation

```sh
npm i -D storybook-addon-themes
```

## Getting started

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory):

```js
import 'storybook-addon-themes/register';
```

## Basic usage

Use the decorator in your stories:

```js
import React from 'react';
import { storiesOf } from '@storybook/react'; // <- or your storybook framework
import { withThemes } from 'storybook-addon-themes';

storiesOf('Button', module)
  .addDecorator(withThemes)
  .add('with text', () => <button>Click me</button>);
```

Or setup the decorator globally in the `config.js` file (located in the Storybook config directory):

```js
import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { withThemes } from 'storybook-addon-themes';

addDecorator(withThemes);
```

## Configuration

Configure the themes in your stories like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react'; // <- or your storybook framework

storiesOf('Button', module)
  .addParameters({
    themes: [
      { name: 'twitter', class: 'theme-twt', color: '#00aced', default: true },
      { name: 'facebook', class: 'theme-fb', color: '#3b5998' },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

Or globally in the `config.js` file:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
  themes: [
    { name: 'twitter', class: 'theme-twt', color: '#00aced', default: true },
    { name: 'facebook', class: 'theme-fb', color: '#3b5998' },
  ],
});
```

And if you want to override themes for a single story or group of stories, pass the `themes` parameter:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .add('with text', () => <button>Click me</button>, {
    themes: [{
      name: 'red', class: 'theme-red', color: 'rgba(255, 0, 0)',
    }]
  });

```

If you don't want to use themes for a story, you can set the `themes` parameter to `[]`, or use `{ disable: true }` to skip the addon:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .add('example 1', () => <button>Click me</button>, {
    themes: [],
  });

storiesOf('Button', module)
  .add('example 2', () => <button>Click me</button>, {
    themes: { disable: true },
  });
```

Also you can add multiple classes by passing an array in `class` parameter:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .addParameters({
    themes: [
      { name: 'twitter', class: ['theme-twt', 'light-mode'], color: '#00aced', default: true },
      { name: 'facebook', class: ['theme-fb', 'dark-mode'], color: '#3b5998' },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

## Usage without the decorator

You can setup this addon without using the decorator.

In this case the classes will be added to the `body` element.

But in this case your theme will not be visible by other addons (like [@storybook/addon-backgrounds](https://github.com/storybookjs/storybook/tree/next/addons/storyshots)).

Also this usage is considered as deprecated and may be removed in the next versions.
