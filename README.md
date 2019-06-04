# Storybook Addon Themes

Greatly inspired by [@storybook/addon-backgrounds](https://github.com/storybooks/storybook/tree/next/addons/backgrounds).

This Storybook Theme Decorator can be used to add a custom HTML class or classes to the the preview in [Storybook](https://storybook.js.org).

## Compatibility

This version is compatible with storybook version `5.x.x`.

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

storiesOf('Button', module)
  .addParameters({
    themes: [
      { name: 'twitter', class: 'theme-twt', color: '#00aced', default: true },
      { name: 'facebook', class: 'theme-fb', color: '#3b5998' },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

You can add the themes to all stories with `addParameters` in `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
  themes: [
    { name: 'twitter', class: 'theme-twt', color: '#00aced', default: true },
    { name: 'facebook', class: 'theme-fb', color: '#3b5998' },
  ],
});
```

If you want to override themes for a single story or group of stories, pass the `themes` parameter:

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
