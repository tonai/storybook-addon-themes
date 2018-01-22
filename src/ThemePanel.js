import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

import Swatch from './Swatch';

const style = {
  font: {
    fontFamily:
      "-apple-system,'.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: '14px',
  },
};

const defaultTheme = {
  name: 'default',
  class: '',
  color: 'transparent',
};

const instructionsHtml = `
import { storiesOf } from "@storybook/react";
import themes from "storybook-addon-themes";
storiesOf("First Component", module)
  .addDecorator(themes([
    { name: "twitter", class: 'theme-twt', color: "#00aced" },
    { name: "facebook", class: 'theme-fb', color: "#3b5998" },
  ]))
  .add("First Button", () => <button>Click me</button>);
`.trim();

const Instructions = () => (
  <div style={Object.assign({ padding: '20px' }, style.font)}>
    <h5 style={{ fontSize: '16px' }}>Setup Instructions</h5>
    <p>
      Please add the themes decorator definition to your story. The themes decorate accepts
      an array of items, which should include a name for your theme
      and the corresponding color / image value.
    </p>
    <p>Below is an example of how to add the theme decorator to your story definition.</p>
    <pre
      style={{
        padding: '30px',
        display: 'block',
        background: 'rgba(19,19,19,0.9)',
        color: 'rgba(255,255,255,0.95)',
        marginTop: '15px',
        lineHeight: '1.75em',
      }}
    >
      <code>{instructionsHtml}</code>
    </pre>
  </div>
);

export default class ThemePanel extends Component {
  constructor(props) {
    super(props);

    const { channel, api } = props;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = {
      themes: [],
      theme: {}
    };

    this.channel.on('theme-set', themes => {
      this.setState({ themes });
      const currentTheme = api.getQueryParam('theme');

      if (currentTheme) {
        this.setThemeInPreview(currentTheme);
      } else if (themes.filter(x => x.default).length) {
        const defaultTheme = themes.filter(x => x.default);
        this.setThemeInPreview(defaultTheme[0]);
      }
    });

    this.channel.on('theme-unset', () => {
      this.setState({ themes: [] });
      api.setQueryParams({ theme: null });
    });
  }

  setThemeInPreview = theme => {
    this.setState({ theme });
    this.channel.emit('theme', theme);
  };

  setThemeFromSwatch = theme => {
    this.setThemeInPreview(theme);
    this.props.api.setQueryParams({ theme });
  };

  render() {
    const themes = [...this.state.themes];

    if (!themes.length) return <Instructions />;

    const hasDefault = themes.filter(x => x.default).length;
    if (!hasDefault) themes.push(defaultTheme);

    return (
      <div style={{ display: 'inline-block', padding: '15px' }}>
        {themes.map(theme => (
          <div key={theme.name} style={{ display: 'inline-block', padding: '5px' }}>
            <Swatch active={theme.name === this.state.theme.name} theme={theme} setTheme={this.setThemeFromSwatch} />
          </div>
        ))}
      </div>
    );
  }
}
ThemePanel.propTypes = {
  api: PropTypes.shape({
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
};
ThemePanel.defaultProps = {
  channel: undefined,
};