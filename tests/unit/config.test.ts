import { describe, expect, it } from 'vitest';
import {
  getConfig,
  getSelectedTheme,
  getThemeClasses,
} from '../../packages/storybook-addon-themes/src/config';
const light = { name: 'light', class: 'light' };
const dark = { name: 'dark', class: ['dark', 'contrast'] };
const list = [light, dark];
describe('configuration', () => {
  it('normalizes absent, partial and legacy array parameters', () => {
    expect(getConfig()).toEqual({ list: [], clearable: true, target: 'body' });
    expect(getConfig(list).list).toBe(list);
    expect(getConfig({ disable: true })).toMatchObject({
      list: [],
      disable: true,
    });
  });
  it('respects explicit false and custom targets', () => {
    expect(getConfig({ list, clearable: false, target: 'root' })).toMatchObject(
      { clearable: false, target: 'root' },
    );
  });
});
describe('selection', () => {
  it('uses a valid global before the default', () => {
    expect(getSelectedTheme({ list, default: 'light' }, 'dark')).toBe(dark);
  });
  it('falls back for stale, absent, and non-string globals', () => {
    for (const selection of ['missing', undefined, null, {}, 42]) {
      expect(getSelectedTheme({ list, default: 'dark' }, selection)).toBe(dark);
    }
  });
  it('lets an explicit clear override defaults', () => {
    expect(getSelectedTheme({ list, default: 'dark' }, 'none')).toBeUndefined();
  });
  it('selects the default or first theme when clearing is disallowed', () => {
    expect(getSelectedTheme({ list, clearable: false }, 'none')).toBe(light);
    expect(
      getSelectedTheme({ list, default: 'dark', clearable: false }, 'none'),
    ).toBe(dark);
  });
  it('supports the deprecated per-theme default after the configured default', () => {
    const legacy = { ...dark, default: true };
    expect(getSelectedTheme({ list: [light, legacy] }, undefined)).toBe(legacy);
    expect(
      getSelectedTheme({ list: [light, legacy], default: 'light' }, undefined),
    ).toBe(light);
  });
  it('returns no theme for disabled, empty, or unconfigured lists', () => {
    expect(getSelectedTheme({ list, disable: true }, 'dark')).toBeUndefined();
    expect(
      getSelectedTheme({ list: [], clearable: false }, 'dark'),
    ).toBeUndefined();
    expect(
      getSelectedTheme({ list, default: 'invalid' }, undefined),
    ).toBeUndefined();
  });
});
it('normalizes and deduplicates CSS class tokens', () => {
  expect(getThemeClasses()).toEqual([]);
  expect(getThemeClasses({ name: 'empty' })).toEqual([]);
  expect(getThemeClasses({ name: 'one', class: '  foo  bar\nfoo ' })).toEqual([
    'foo',
    'bar',
  ]);
  expect(
    getThemeClasses({ name: 'many', class: ['foo bar', 'bar', 'baz'] }),
  ).toEqual(['foo', 'bar', 'baz']);
});
