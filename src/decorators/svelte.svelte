<script>
  import { onDestroy, onMount } from 'svelte';
  import addons from '@storybook/addons';

  import { CHANGE, THEME } from '../constants';
  import { getSelectedTheme, getSelectedThemeName } from '../shared';

  import { getHtmlClasses } from './shared';

  export let config;

  const channel = addons.getChannel();
  const lastValue = channel.last(CHANGE);
  const { list } = config;

  let themeName = (lastValue && lastValue[0]) || getSelectedThemeName(list);

  function setThemeName(theme) {
    themeName = theme;
  }

  onMount(() => channel.on(CHANGE, setThemeName));
  onDestroy(() => channel.removeListener(CHANGE, setThemeName));
</script>

<div class={getHtmlClasses(getSelectedTheme(list, themeName))}>
  <slot></slot>
</div>
