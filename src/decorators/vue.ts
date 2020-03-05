import addons from '@storybook/addons';

import { CHANGE, THEME } from '../constants';
import { Theme } from '../models';
import { getSelectedTheme, getSelectedThemeName } from '../shared';

import { getHtmlClasses } from './shared';

export const ThemeDecorator = {
  beforeDestroy() {
    const channel = addons.getChannel();
    channel.removeListener(CHANGE, this.updateStore);
    this.unsubscribe();
  },
  computed: {
    theme(): Theme {
      return getSelectedTheme(this.config.list, this.themeName);
    },
    themeClasses(): string {
      return getHtmlClasses(this.theme);
    },
    themeName(): string {
      return this.storeTheme || getSelectedThemeName(this.config.list);
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
<component
  v-if="this.config.Decorator"
  :is="this.config.Decorator"
  :theme="theme"
  :themes="this.config.list"
  :themeClasses="themeClasses"
  :themeName="themeName"
>
  <slot></slot>
</component>
<div v-else :class="themeClasses">
  <slot></slot>
</div>`,
  updated() {
    const channel = addons.getChannel();
    channel.emit(THEME, this.themeName);
  }
};
