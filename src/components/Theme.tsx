import React, { useEffect } from 'react';
// @ts-ignore
import { document } from 'global';

import { ThemeConfig } from '../models';

interface Props {
  iframeId: string;
  selectedTheme: ThemeConfig;
  themes: ThemeConfig[];
}

export function Theme(props: Props): null {
  const { iframeId, selectedTheme, themes } = props;

  useEffect(() => {
    const iframe = document.getElementById(iframeId);
    if (!iframe) {
      return null;
    }

    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const { body } = iframeDocument;

    // Add selected theme class.
    if (selectedTheme) {
      body.classList.add(selectedTheme.class);
    }

    return () => themes
      .filter(theme => theme.class)
      .forEach(theme => body.classList.remove(theme.class));
  });

  return null;
}