import { afterEach, describe, expect, it } from 'vitest';
import { applyTheme, observeTheme } from '../../src/dom';
afterEach(() => {
  document.body.innerHTML = '';
  document.body.className = '';
  document.documentElement.className = '';
});
const dark = { name: 'dark', class: ['dark', 'contrast'] };
describe('class ownership', () => {
  it('adds and removes only owned classes, preserving preexisting theme classes', () => {
    document.body.className = 'app dark';
    const cleanup = applyTheme(document.body, dark);
    expect(document.body.className).toBe('app dark contrast');
    cleanup();
    cleanup();
    expect(document.body.className).toBe('app dark');
  });
  it('does not remove classes still used by another docs canvas', () => {
    const a = applyTheme(document.body, dark);
    const b = applyTheme(document.body, dark);
    a();
    expect(document.body.className).toBe('dark contrast');
    b();
    expect(document.body.className).toBe('');
  });
  it('handles an empty selection', () => {
    const cleanup = applyTheme(document.body);
    cleanup();
    expect(document.body.className).toBe('');
  });
});
describe('target lifecycle', () => {
  it('supports body and root targets and cleans up', () => {
    for (const target of ['body', 'root']) {
      const cleanup = observeTheme(document, target, dark);
      const element =
        target === 'root' ? document.documentElement : document.body;
      expect(element.classList.contains('dark')).toBe(true);
      cleanup();
      expect(element.classList.contains('dark')).toBe(false);
    }
  });
  it('handles targets mounted late and replaced by the renderer', async () => {
    const cleanup = observeTheme(document, '.card', dark);
    const first = document.createElement('div');
    first.className = 'card';
    document.body.append(first);
    await Promise.resolve();
    expect(first.classList.contains('dark')).toBe(true);
    const replacement = document.createElement('div');
    replacement.className = 'card';
    first.replaceWith(replacement);
    await Promise.resolve();
    expect(first.className).toBe('card');
    expect(replacement.classList.contains('dark')).toBe(true);
    replacement.remove();
    await Promise.resolve();
    expect(replacement.className).toBe('card');
    cleanup();
    document.body.append(first);
    await Promise.resolve();
    expect(first.className).toBe('card');
  });
  it('leaves a missing target alone and rejects invalid selectors', () => {
    observeTheme(document, '.missing', dark)();
    expect(() => observeTheme(document, '[', dark)).toThrow();
  });
});
