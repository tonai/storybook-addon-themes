<script>
  import { onDestroy, onMount } from 'svelte';
  import addons from '@storybook/addons';

  import { CHANGE, THEME } from '../constants';
  import { getSelectedTheme } from '../shared';

  import { getHtmlClasses, getTheme } from './shared';

  export let config;

  const channel = addons.getChannel();
  const lastValue = channel.last(CHANGE);

  let theme = (lastValue && lastValue[0]) || getSelectedTheme(config.list);

  function setTheme(themeName) {
    theme = themeName;
  }

  onMount(() => channel.on(CHANGE, setTheme));
  onDestroy(() => channel.removeListener(CHANGE, setTheme));
</script>

<div class={getHtmlClasses(getTheme(config, theme))}>
  <slot></slot>
</div>
