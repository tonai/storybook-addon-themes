<script>
  import { onDestroy } from 'svelte';
  import addons from '@storybook/addons';

  import { CHANGE, THEME } from '../constants';
  import { getSelectedTheme } from '../shared';

  import { getHtmlClasses, getTheme } from './shared';

  export let config;

  const channel = addons.getChannel();
  const lastValue = channel.last(CHANGE);
  channel.on(CHANGE, setTheme);

  let theme = (lastValue && lastValue[0]) || getSelectedTheme(config.list);

  function setTheme(themeName) {
    theme = themeName;
  }

  onDestroy(() => {
    channel.removeListener(CHANGE, setTheme);
  });
</script>

<div class={getHtmlClasses(getTheme(config, theme))}>
  <slot></slot>
</div>
