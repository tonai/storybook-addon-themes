import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import memoize from 'memoizerific';

import { API, useGlobals, useParameter } from '@storybook/api';
import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { CHANGE, DECORATOR, PARAM_KEY, THEME } from '../constants';
import { Theme, ThemeConfig, ThemeSelectorItem } from '../models';
import { defaultOptions, getConfigFromApi, getSelectedTheme, getSelectedThemeName } from '../shared';

import { ColorIcon } from './ColorIcon';
import { ThemeStory } from './ThemeStory';

const iframeId = 'storybook-preview-iframe';

const createThemeSelectorItem = memoize(1000)(
  (
    id: string,
    title: string,
    color: string,
    hasSwatch: boolean,
    change: (arg: { selected: string; expanded: boolean }) => void,
    active: boolean,
  ): ThemeSelectorItem => ({
    id,
    title,
    onClick: () => {
      change({ selected: id, expanded: false });
    },
    value: id,
    right: hasSwatch ? <ColorIcon background={color} /> : undefined,
    active,
  })
);

const getDisplayableState = memoize(10)(
  (config: ThemeConfig, state: ThemeToolState, change) => {
    const { clearable, list, target, default: defaultTheme } = config;
    const selectedThemeName = getSelectedThemeName(list, defaultTheme, state.selected);

    let availableThemeSelectorItems: ThemeSelectorItem[] = [];
    let selectedTheme: Theme;

    if (selectedThemeName !== 'none' && clearable) {
      availableThemeSelectorItems.push(
        createThemeSelectorItem('none', 'Clear theme', 'transparent', null, change, false)
      );
    }

    if (list.length) {
      availableThemeSelectorItems = [
        ...availableThemeSelectorItems,
        ...list.map(({ color, name }) =>
          createThemeSelectorItem(name, name, color, true, change, name === selectedThemeName)
        ),
      ];
      selectedTheme = getSelectedTheme(list, selectedThemeName);
    }

    return {
      items: availableThemeSelectorItems,
      selectedTheme,
      themes: list,
      target,
    };
  }
);

interface ThemeToolProps {
  api: API;
}

interface ThemeToolState {
  decorator: boolean,
  selected: string;
  expanded: boolean;
}

export const ThemeSelector: FC<ThemeToolProps> = ({ api }) => {
  const [decorator, setDecorator] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [globals, updateGlobals] = useGlobals();

  const themesConfig = useParameter<ThemeConfig>(
    PARAM_KEY,
    defaultOptions
  );
  const selected: string = globals[PARAM_KEY]?.value;

  const setSelected = useCallback(
    (value: string) => {
      updateGlobals({ [PARAM_KEY]: { ...globals[PARAM_KEY], value } });
    },
    [themesConfig, globals, updateGlobals]
  );

  const clearSelection = () => setSelected(null);
  const setDecoratorTrue = () => setDecorator(true);

  const change = (args: { selected: string; expanded: boolean }) => {
    const { list, onChange } = getConfigFromApi(api);

    setExpanded(args.expanded);

    api.emit(CHANGE, args.selected);

    if (typeof onChange === 'function') {
      const selectedTheme = getSelectedTheme(list, args.selected);
      onChange(selectedTheme);
    }

    setSelected(args.selected);
  };

  const { items, selectedTheme, target, themes } = getDisplayableState(
    themesConfig,
    {
      decorator,
      selected,
      expanded,
    },
    change
  );

  useEffect(() => {
    api.on(SET_STORIES, clearSelection);
    api.on(THEME, setSelected);
    api.on(DECORATOR, setDecoratorTrue);

    if (!selected) {
      const selectedName = getSelectedThemeName(themesConfig.list, themesConfig.default)
      setSelected(selectedName);
    }

    return () => {
      api.off(SET_STORIES, clearSelection);
      api.off(THEME, setSelected);
      api.off(DECORATOR, setDecoratorTrue);
    }
  }, [clearSelection, setSelected, setDecoratorTrue]);

  return items.length ? (
    <Fragment>
      {!decorator && (
        <ThemeStory iframeId={iframeId} selectedTheme={selectedTheme} target={target} themes={themes} />
      )}
      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={expanded}
        onVisibilityChange={setExpanded}
        tooltip={<TooltipLinkList links={items} />}
        closeOnClick
      >
        <IconButton
          key="theme"
          active={selectedTheme}
          title="Change the theme of the preview"
        >
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>
    </Fragment>
  ) : null;
}
