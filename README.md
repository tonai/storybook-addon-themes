# Storybook Addon Backgrounds

Greatly inspired by [@storybook/addon-backgrounds](https://github.com/storybooks/storybook/tree/master/addons/background).

This Storybook Theme Decorator can be used to add a custom HTML class to the the preview in [Storybook](https://storybook.js.org).

This addon works with Storybook for:

- [React](https://github.com/storybooks/storybook/tree/master/app/react)

## Compatibility

This version is compatible with storybook version `3.x.x`.

## Installation

```sh
npm i --save storybook-addon-themes
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
import { storiesOf } from "@storybook/react";
import withThemes from "storybook-addon-themes";

storiesOf("Button", module)
  .addDecorator(withThemes([
    { name: "twitter", class: "theme-twt", color: "#00aced", default: true },
    { name: "facebook", class: "theme-fb", color: "#3b5998" },
  ]))
  .add("with text", () => <button>Click me</button>);
```
