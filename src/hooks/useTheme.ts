import { useEffect, useState } from 'react';

import { Store } from '../store';

export function useTheme(store: Store): string {
  const selected = store.get('theme');
  const [theme, setTheme] = useState<string>(selected);
  useEffect(() => {
    return store.subscribe((key: any, value: string) => {
      if (key === 'theme') {
        setTheme(value);
      }
    });
  }, []);
  return theme;
}
