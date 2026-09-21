import { getThemeClasses } from './config';
import type { Theme } from './types';

// Reference counting prevents one Docs canvas from removing another canvas's theme.
const owners = new WeakMap<
  Element,
  Map<string, { count: number; original: boolean }>
>();

export function applyTheme(element: Element, theme?: Theme): () => void {
  const classes = getThemeClasses(theme);
  let registry = owners.get(element);
  if (!registry) {
    registry = new Map();
    owners.set(element, registry);
  }
  for (const name of classes) {
    const entry = registry.get(name) ?? {
      count: 0,
      original: element.classList.contains(name),
    };
    entry.count++;
    registry.set(name, entry);
    element.classList.add(name);
  }
  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    for (const name of classes) {
      const entry = registry.get(name)!;
      if (--entry.count === 0) {
        if (!entry.original) element.classList.remove(name);
        registry.delete(name);
      }
    }
  };
}

/** Observe custom targets because a framework may mount them after the decorator runs. */
export function observeTheme(
  document: Document,
  target: string,
  theme?: Theme,
): () => void {
  const selector = target === 'root' ? ':root' : target;
  // Validate once; don't throw repeatedly from a MutationObserver callback.
  document.querySelector(selector);
  let current: Element | null = null;
  let cleanup: (() => void) | undefined;
  const update = () => {
    const next = document.querySelector(selector);
    if (next === current) return;
    cleanup?.();
    current = next;
    cleanup = next ? applyTheme(next, theme) : undefined;
  };
  update();
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  return () => {
    observer.disconnect();
    cleanup?.();
  };
}
