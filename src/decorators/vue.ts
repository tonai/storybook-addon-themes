import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { getSelectedTheme } from '../shared';

import { getHtmlClasses, getTheme } from './shared';

export const ThemeDecorator = {
  beforeDestroy() {
    const channel = addons.getChannel();
    channel.removeListener(CHANGE, this.updateStore);
    this.unsubscribe();
  },
  computed: {
    themeClasses(): string {
      return getHtmlClasses(getTheme(this.config, this.themeName));
    },
    themeName(): string {
      return this.storeTheme || getSelectedTheme(this.config.list);
    }
  },
  data() {
    return {
      storeTheme: this.store.get('theme')
    };
  },
  methods: {
    updateStore(theme: string) {
      this.store.set('theme', theme);
    }
  },
  mounted() {
    this.unsubscribe = this.store.subscribe((key: any, value: string) => {
      if (key === 'theme') {
        this.storeTheme = value;
      }
    });

    const channel = addons.getChannel();
    channel.on(CHANGE, this.updateStore);
  },
  props: [ 'config', 'store' ],
  template: `
<div :class="themeClasses">
  <slot></slot>
</div>`,
  updated() {
    const channel = addons.getChannel();
    channel.emit(THEME, this.themeName);
  }
};
