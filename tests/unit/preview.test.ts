import { afterEach, expect, it, vi } from 'vitest';
import type { StoryContext } from 'storybook/internal/types';
const effects = vi.hoisted(() => [] as Array<() => void | (() => void)>);
vi.mock('storybook/preview-api', () => ({
  useEffect: (effect: () => void | (() => void)) => {
    effects.push(effect);
  },
}));
import preview, {
  withThemes,
} from '../../packages/storybook-addon-themes/src/preview';
const cleanups: Array<() => void> = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  effects.length = 0;
  document.body.className = '';
  vi.restoreAllMocks();
});
function render(themes: unknown, selection?: string) {
  const story = vi.fn(() => 'story content');
  const result = withThemes(story, {
    id: 'test',
    parameters: { themes },
    globals: { theme: selection },
  } as unknown as StoryContext);
  for (const effect of effects.splice(0)) {
    const cleanup = effect();
    if (cleanup) cleanups.push(cleanup);
  }
  expect(result).toBe('story content');
  expect(story).toHaveBeenCalledOnce();
}
it('registers the universal decorator', () => {
  expect(preview.decorators).toEqual([withThemes]);
});
it('applies the selected theme and runs preview callbacks with cleanup', () => {
  const cleanup = vi.fn();
  const onChange = vi.fn(() => cleanup);
  const theme = { name: 'dark', class: 'dark' };
  render({ list: [theme], onChange }, 'dark');
  expect(document.body.className).toBe('dark');
  expect(onChange).toHaveBeenCalledWith(theme);
  cleanups.splice(0).forEach((fn) => fn());
  expect(document.body.className).toBe('');
  expect(cleanup).toHaveBeenCalledOnce();
});
it('skips disabled themes and callbacks', () => {
  const onChange = vi.fn();
  render({ disable: true, onChange });
  expect(document.body.className).toBe('');
  expect(onChange).not.toHaveBeenCalled();
});
it('handles absent configuration and reports invalid targets without breaking stories', () => {
  render(undefined);
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  render({ target: '[', list: [] });
  expect(warn).toHaveBeenCalledOnce();
});
it('supports clearing and a custom target', () => {
  const onChange = vi.fn();
  render({ target: 'root', list: [], onChange }, 'none');
  expect(onChange).toHaveBeenCalledWith(undefined);
});

it('uses body when target is explicitly undefined', () => {
  render({
    target: undefined,
    default: 'dark',
    list: [{ name: 'dark', class: 'dark' }],
  });
  expect(document.body.className).toBe('dark');
});
