import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { getSelectedTheme } from '../shared';

import { getHtmlClasses, getTheme } from './shared';

const channel = addons.getChannel();

export const ThemeDecorator = {
  beforeDestroy() {
    channel.removeListener(CHANGE, this.setTheme);
  },
  computed: {
    themeClasses(): string {
      return getHtmlClasses(getTheme(this.config, this.theme));
    },
  },
  data() {
    const lastValue = channel.last(CHANGE);
    return {
      theme: (lastValue && lastValue[0]) || getSelectedTheme(this.config.list)
    };
  },
  methods: {
    setTheme(theme: string) {
      this.theme = theme;
    }
  },
  mounted() {
    const channel = addons.getChannel();
    channel.on(CHANGE, this.setTheme);
  },
  props: [ 'config' ],
  template: `
<div :class="themeClasses">
  <slot></slot>
</div>`
};
