import * as uuid from 'uuid'

import { ChannelItem } from '../models/ChannelItem'
import { ChannelDao } from '../dataLayer/channelDao'
import { CreateChannelRequest } from '../requests/channel/CreateChannelRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('channel')

const channelDao = new ChannelDao()

export async function getAllChannelItems(serverId: string): Promise<ChannelItem[]> {
  return channelDao.getAllChannelItems(serverId)
}

export async function channelExists(channelId: string) {
    return await channelDao.channelExists(channelId)
}

export async function createChannel(createChannelRequest: CreateChannelRequest,
                                    serverId: string,
                                    userId: string
                                   ): Promise<ChannelItem> {
  const channelId = uuid.v4()
  const timestamp: string = new Date().toISOString()
  logger.info('Create new Channel: ', {'channelId': channelId, 'serverId': serverId, 'createdBy': userId, 'createdAt': timestamp})

  const newChannel: ChannelItem = {
      serverId,
      channelId,
      createdBy: userId,
      createdAt: timestamp,
      ...createChannelRequest
  }

  return await channelDao.createChannel(newChannel)
}