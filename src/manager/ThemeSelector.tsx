import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';

import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { CHANGE, DECORATOR, THEME } from '../constants';
import { Api, Theme, ThemeSelectorItem } from '../models';
import { getConfigFromApi, getSelectedTheme, getSelectedThemeName } from '../shared';

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
  (props: ThemeToolProps, state: ThemeToolState, change) => {
    const { list, attribute } = getConfigFromApi(props.api);
    const selectedThemeName = getSelectedThemeName(list, state.selected);

    let availableThemeSelectorItems: ThemeSelectorItem[] = [];
    let selectedTheme: Theme;

    if (selectedThemeName !== 'none') {
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
      attribute
    };
  }
);

interface ThemeToolProps {
  api: Api;
}

interface ThemeToolState {
  decorator: boolean,
  items: ThemeSelectorItem[];
  selected: string;
  expanded: boolean;
}

export class ThemeSelector extends Component<ThemeToolProps, ThemeToolState> {
  state: ThemeToolState = {
    decorator: false,
    items: [],
    selected: null,
    expanded: false,
  };

  private setStories = () => this.setState({ selected: null });

  private setTheme = (theme: string) => this.setState({ selected: theme });

  private setDecorator = () => this.setState({ decorator: true });

  componentDidMount() {
    const { api } = this.props;
    api.on(SET_STORIES, this.setStories);
    api.on(THEME, this.setTheme);
    api.on(DECORATOR, this.setDecorator);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(SET_STORIES, this.setStories);
    api.off(THEME, this.setTheme);
    api.off(DECORATOR, this.setDecorator);
  }

  change = (args: { selected: string; expanded: boolean }) => {
    const { selected } = args;
    const { api } = this.props;
    const { decorator } = this.state;

    this.setState(args);
    if (decorator) {
      api.emit(CHANGE, selected);
    }
  };

  render() {
    const { decorator, expanded } = this.state;
    const { items, selectedTheme, themes, attribute } = getDisplayableState(
      this.props,
      this.state,
      this.change
    );

    return items.length ? (
      <Fragment>
        {!decorator && (
          <ThemeStory iframeId={iframeId} selectedTheme={selectedTheme} themes={themes} attribute={attribute} />
        )}
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
