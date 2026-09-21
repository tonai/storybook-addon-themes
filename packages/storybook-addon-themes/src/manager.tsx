import React from 'react';
import { addons, types, useGlobals, useParameter } from 'storybook/manager-api';
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from 'storybook/internal/components';
import { PaintBrushIcon } from '@storybook/icons';
import { ADDON_ID, GLOBAL_KEY, NONE } from './constants';
import { getConfig, getSelectedTheme } from './config';
import type { ThemesParameter } from './types';

function ThemeTool() {
  const parameter = useParameter<ThemesParameter>('themes');
  const config = getConfig(parameter);
  const [globals, updateGlobals, storyGlobals] = useGlobals();
  const theme = getSelectedTheme(config, globals[GLOBAL_KEY]);
  const locked = storyGlobals?.[GLOBAL_KEY] !== undefined;
  if (config.disable || !config.list.length) return null;
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnOutsideClick
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={[
            ...(config.clearable
              ? [
                  {
                    id: NONE,
                    title: 'Clear theme',
                    active: !theme,
                    onClick: () => {
                      updateGlobals({ [GLOBAL_KEY]: NONE });
                      onHide();
                    },
                  },
                ]
              : []),
            ...config.list.map((item) => ({
              id: item.name,
              title: item.name,
              active: item.name === theme?.name,
              right: item.color ? (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: item.color,
                    border: '1px solid currentColor',
                  }}
                />
              ) : undefined,
              onClick: () => {
                updateGlobals({ [GLOBAL_KEY]: item.name });
                onHide();
              },
            })),
          ]}
        />
      )}
    >
      <IconButton
        key="themes"
        title={locked ? 'Theme is fixed by this story' : 'Change theme'}
        aria-label={locked ? 'Theme is fixed by this story' : 'Change theme'}
        disabled={locked}
        active={!!theme}
      >
        <PaintBrushIcon />{' '}
        <span style={{ marginLeft: 6 }}>{theme?.name ?? 'Theme'}</span>
      </IconButton>
    </WithTooltip>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Themes',
    match: ({ viewMode }) => viewMode === 'story',
    render: ThemeTool,
  });
});
