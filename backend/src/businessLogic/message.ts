import * as uuid from 'uuid'

import { MessageItem } from '../models/MessageItem'
import { MessageDao } from '../dataLayer/messageDao'
import { MessageRequest } from '../requests/message/MessageRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('message')

const messageDao = new MessageDao()

export async function getAllMessageItems(channelId: string): Promise<MessageItem[]> {
  return messageDao.getAllMessageItems(channelId)
}

export async function messageExists(channelId: string, messageId: string) {
  return await messageDao.messageExists(channelId, messageId)
}

export async function createMessage(createMessageRequest: MessageRequest,
                                    channelId: string,
                                    userId: string
                                   ): Promise<MessageItem> {
  const messageId = uuid.v4()
  const timestamp: string = new Date().toISOString()
  logger.info('Create new Message: ', {'channelId': channelId, 'messageId': messageId, 'createdBy': userId, 'createdAt': timestamp})

  const newMessage: MessageItem = {
    channelId,
    messageId,
    createdBy: userId,
    createdAt: timestamp,
    ...createMessageRequest
  }

  return await messageDao.createMessage(newMessage)
}

export async function getMessageCreatedBy(channelId: string, messageId: string): Promise<string> {
  return await messageDao.getMessageCreatedBy(channelId, messageId)
}

export async function updateMessage(channelId: string, messageId: string, updatedMessage: MessageRequest) {
  return await messageDao.updateMessage(channelId, messageId, updatedMessage)
}

export async function deleteMessage(channelId: string, messageId: string) {
  return await messageDao.deleteMessage(channelId, messageId)
}

export async function getUploadUrl(messageId: string): Promise<string> {
  return await messageDao.getUploadUrl(messageId)
}

export async function uploadAttachment(channelId: string, messageId: string) {
  return await messageDao.uploadAttachment(channelId, messageId)
}
