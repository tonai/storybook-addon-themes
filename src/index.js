import React from 'react';
import PropTypes from 'prop-types';

import addons from '@storybook/addons';

export class ThemeDecorator extends React.Component {
  constructor(props) {
    super(props);

    const { channel, story } = props;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = { background: 'transparent' };

    this.story = story();
  }

  componentWillMount() {
    this.channel.on('theme', this.setTheme);
    this.channel.emit('theme-set', this.props.themes);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.story !== this.props.story) {
      this.story = nextProps.story();
    }
  }

  componentWillUnmount() {
    this.channel.removeListener('theme', this.setTheme);
    this.channel.emit('theme-unset');
  }

  setTheme = theme => this.setState({ theme });

  render() {
    return <div className={this.state.theme && this.state.theme.class ? this.state.theme.class : ''}>{this.story}</div>;
  }
}
ThemeDecorator.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.object),
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
  story: PropTypes.func.isRequired,
};
ThemeDecorator.defaultProps = {
  themes: [],
  channel: undefined,
};

export default themes => story => (
  <ThemeDecorator story={story} themes={themes} />
);