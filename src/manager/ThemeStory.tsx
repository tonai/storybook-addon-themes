import React, { useEffect } from 'react';
// @ts-ignore
import { document } from 'global';

import { Theme } from '../models';

interface Props {
  iframeId: string;
  selectedTheme: Theme;
  themes: Theme[];
  attribute: string;
}

export const ThemeStory: React.FC<Props> = (props) => {
  const { iframeId, selectedTheme, themes, attribute } = props;

  useEffect(() => {
    const iframe = document.getElementById(iframeId);
    if (!iframe) {
      return null;
    }

    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const { body } = iframeDocument;

    // Add selected theme class(es).
    if (selectedTheme && selectedTheme.class) {
      if (!attribute || attribute === 'class') {
        if (typeof selectedTheme.class === 'string') {
          body.classList.add(selectedTheme.class)
        } else { // string[]
          body.classList.add(...selectedTheme.class)
        }
      } else {
        const value = typeof selectedTheme.class === 'string' ? selectedTheme.class : selectedTheme.class.join(' ');
        body.setAttribute(attribute, value)
      }
    }

    if (!selectedTheme && attribute !== 'class') {
      body.removeAttribute(attribute);
    }

    return () => themes
      .filter(theme => theme.class)
      .forEach(theme => {
        if (!attribute || attribute === 'class') {
          if (typeof theme.class === 'string') {
            body.classList.remove(theme.class)
          } else { // string[]
            body.classList.remove(...theme.class)
          }
        }
      });
  });

  return null;
}
