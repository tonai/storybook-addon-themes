import addons, { Listener } from '@storybook/addons';

import { ADDON_ID, CHANGE } from '../constants';
import { DecoratorProps, Theme, ThemeConfig } from '../models';
import { getSelectedTheme, getSelectedThemeName } from '../shared';

import { getHtmlClasses } from './shared';

const channel = addons.getChannel();

let prevCallback: Listener;
function subscribe(callback: Listener) {
  if (prevCallback) {
    channel.removeListener(CHANGE, prevCallback);
  }
  if (callback) {
    channel.on(CHANGE, callback);
  }
  prevCallback = callback;
}

/*
 * getOrCreate creates a new div with its id in case of the element hasn't been created before, on another it will return the found element with the id.
 * id {string}: is required to create or find the div element, unique id for the div.
 * justCreate {boolean}: by default it's false, if it's 'true' will just create the element, and remove the element that already exists.
 */
function getOrCreate(id: string, justCreate: boolean = false): HTMLDivElement {
  const elementOnDom = document.getElementById(id) as HTMLDivElement;
  if (justCreate && elementOnDom && elementOnDom.parentElement) {
    elementOnDom.parentElement.removeChild(elementOnDom);
  } else if (elementOnDom) {
    return elementOnDom;
  }

  const element = document.createElement('div') as HTMLDivElement;
  element.setAttribute('id', id);
  return element;
}

function createCallback(list: Theme[], callback: Function) {
  return (themeName: string) => {
    const theme = getSelectedTheme(list, themeName);
    const themeClasses = getHtmlClasses(theme);
    callback({theme, themes: list, themeClasses, themeName});
  }
}

export function ThemeDecorator(config: ThemeConfig, element: string|Node) {
  const { Decorator, list, default: defaultTheme } = config;
  const lastValue = channel.last(CHANGE);
  const themeName = (lastValue && lastValue[0]) || getSelectedThemeName(list, defaultTheme);
  const theme = getSelectedTheme(list, themeName);
  const themeClasses = getHtmlClasses(theme);

  const wrapper = getOrCreate(ADDON_ID, true);

  if (element instanceof Node) {
    wrapper.innerHTML = '';
    wrapper.appendChild(element);
  } else {
    wrapper.innerHTML = element;
  }

  if (Decorator) {
    // @ts-ignore
    const [decorator, callback] = Decorator({children: wrapper, theme, themes: list, themeClasses, themeName});
    subscribe(createCallback(list, callback));
    return decorator;
  }

  wrapper.setAttribute('class', themeClasses);
  subscribe(createCallback(list, ({ themeClasses }: DecoratorProps) => wrapper.setAttribute('class', themeClasses)));
  return wrapper;
}
