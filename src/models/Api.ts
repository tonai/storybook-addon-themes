import { SubAPI as StoriesAPI } from '@storybook/api/dist/modules/stories'
import { SubAPI as ChannelAPI } from '@storybook/api/dist/modules/channel'
export interface Api extends StoriesAPI, ChannelAPI {}
