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
    attribute(): string {
      if (this.config.attribute !== 'class') {
        return this.config.attribute;
      }

      return '';
    },
    themeClasses(): string {
      return getHtmlClasses(this.theme);
    },
    themeValue(): string {
      if (this.config.attribute !== 'class') {
        return this.theme.value;
      }

      return '';
    },
    themeName(): string {
      return this.storeTheme || getSelectedThemeName(this.config.list);
    },
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
  :attribute="this.config.attribute"
  :theme="theme"
  :themes="this.config.list"
  :themeClasses="themeClasses"
  :themeName="themeName"
  :themeValue="themeValue"
>
  <slot></slot>
</component>
<div v-else :[attribute]="themeValue" :class="themeClasses">
  <slot></slot>
</div>`,
  updated() {
    const channel = addons.getChannel();
    channel.emit(THEME, this.themeName);
  }
};
