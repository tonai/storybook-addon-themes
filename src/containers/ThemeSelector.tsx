import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';

import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY } from '../constants';
import { ColorIcon, Theme } from '../components';
import { ThemeConfig, ThemeSelectorItem } from '../models';

const iframeId = 'storybook-preview-iframe';

const createThemeSelectorItem = memoize(1000)(
  (
    id: string,
    title: string,
    color: string,
    hasSwatch: boolean,
    change: (arg: { selected: string; expanded: boolean }) => void
  ): ThemeSelectorItem => ({
    id,
    title,
    onClick: () => {
      change({ selected: id, expanded: false });
    },
    value: id,
    right: hasSwatch ? <ColorIcon background={color} /> : undefined,
  })
);

const getSelectedTheme = (
  list: ThemeConfig[],
  currentSelectedValue: string
): string => {
  if (!list.length) {
    return 'none';
  }

  if (currentSelectedValue === 'none') {
    return currentSelectedValue;
  }

  if (list.find(i => i.name === currentSelectedValue)) {
    return currentSelectedValue;
  }

  if (list.find(i => i.default)) {
    return list.find(i => i.default).name;
  }

  return 'none';
};

const getDisplayableState = memoize(10)(
  (props: ThemeToolProps, state: ThemeToolState, change) => {
    const data = props.api.getCurrentStoryData();
    const list: ThemeConfig[] = (data && data.parameters && data.parameters[PARAM_KEY]) || [];

    const selectedThemeName = getSelectedTheme(list, state.selected);

    let availableThemeSelectorItems: ThemeSelectorItem[] = [];
    let selectedTheme: ThemeConfig;

    if (selectedThemeName !== 'none') {
      availableThemeSelectorItems.push(
        createThemeSelectorItem('none', 'Clear theme', 'transparent', null, change)
      );
    }

    if (list.length) {
      availableThemeSelectorItems = [
        ...availableThemeSelectorItems,
        ...list.map(({ color, name }) =>
          createThemeSelectorItem(name, name, color, true, change)
        ),
      ];
      selectedTheme = list.find(theme => theme.name === selectedThemeName)
    }

    return {
      items: availableThemeSelectorItems,
      selectedTheme,
      themes: list,
    };
  }
);

interface ThemeToolProps {
  api: {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    getCurrentStoryData(): any;
  };
}

interface ThemeToolState {
  items: ThemeSelectorItem[];
  selected: string;
  expanded: boolean;
}

export class ThemeSelector extends Component<ThemeToolProps, ThemeToolState> {
  private listener = () => {
    this.setState({ selected: null });
  };

  constructor(props: ThemeToolProps) {
    super(props);

    this.state = {
      items: [],
      selected: null,
      expanded: false,
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(SET_STORIES, this.listener);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(SET_STORIES, this.listener);
  }

  change = (args: { selected: string; expanded: boolean }) => this.setState(args);

  render() {
    const { expanded } = this.state;
    const { items, selectedTheme, themes } = getDisplayableState(
      this.props,
      this.state,
      this.change
    );

    return items.length ? (
      <Fragment>
        <Theme iframeId={iframeId} selectedTheme={selectedTheme} themes={themes} />
        <WithTooltip
          placement="top"
          trigger="click"
          tooltipShown={expanded}
          onVisibilityChange={(newVisibility: boolean) =>
            this.setState({ expanded: newVisibility })
          }
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
}