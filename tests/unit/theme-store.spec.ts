import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useThemeStore } from '@/stores/theme';

// The store is a thin policy layer over the package's theme singleton. What is
// worth testing is the policy — that the site's default neutral follows the
// mode, and that an explicit choice by the reader is never overridden.

describe('theme store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    setActivePinia(createPinia());
  });

  it('starts unhydrated and becomes ready exactly once', () => {
    const store = useThemeStore();

    expect(store.ready).toBe(false);
    store.init();
    expect(store.ready).toBe(true);

    // A second call is a no-op, so a remount cannot clobber a live choice.
    store.setNeutral('slate');
    store.init();
    expect(store.neutral).toBe('slate');
  });

  it('applies the site default neutral for the current scheme', () => {
    const store = useThemeStore();
    store.init();

    expect(store.neutral).toBe('stone');
  });

  it('follows the mode while the neutral is still a default', () => {
    const store = useThemeStore();
    store.init();

    store.setTheme('dark');
    expect(store.theme).toBe('dark');
    expect(store.neutral).toBe('charcoal');

    store.setTheme('light');
    expect(store.neutral).toBe('stone');
  });

  it('never overrides a neutral the reader chose', () => {
    const store = useThemeStore();
    store.init();
    store.setNeutral('slate');

    store.setTheme('dark');

    expect(store.neutral).toBe('slate');
  });

  it('writes through to the shared preference, which persists it', () => {
    const store = useThemeStore();
    store.init();

    store.setTheme('dark');
    store.setRadius('0.5');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('ts-school-theme-preference')).toBe('dark');
    // Remapper must not leave a shared vanduo-* key for other vd3 origins.
    const vanduoKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith('vanduo-')) vanduoKeys.push(key);
    }
    expect(vanduoKeys).toEqual([]);
  });

  it('returns to the site defaults on reset', () => {
    const store = useThemeStore();
    store.init();
    store.setNeutral('slate');
    store.setTheme('dark');

    store.reset();

    expect(store.neutral).toBe('stone');
  });
});
