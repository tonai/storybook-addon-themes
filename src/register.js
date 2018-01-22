import React from 'react';
import addons from '@storybook/addons';

import ThemePanel from './ThemePanel';

const ADDON_ID = 'storybook-addon-theme';
const PANEL_ID = `${ADDON_ID}/theme-panel`;

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'themes',
    render: () => <ThemePanel channel={channel} api={api} />,
  });
});
