import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'
import { messageExists, deleteMessage, getMessageCreatedBy } from '../../../businessLogic/message'
import { channelExists } from '../../../businessLogic/channel'

const logger = createLogger('deleteMessage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const channelId = event.pathParameters.channelId
    const messageId = event.pathParameters.messageId
    const userId: string = getUserId(event)
    logger.info("Starting Message deletion attempt: ", {'userId': userId, 'channelId': channelId, 'messageId': messageId})
  
    const validChannel = await channelExists(channelId)
    if(!validChannel) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Channel not found'
        })
      }
    }
    
    const validMessage = await messageExists(channelId, messageId)
    if(!validMessage) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Message not found'
        })
      }
    }

    const messsageCreateBy: string = await getMessageCreatedBy(channelId, messageId)
    if(userId !== messsageCreateBy) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'Action forbidden - only message creator can delete message'
        })
      }
    }

  
  logger.info('Delete Message: ', {'channelId': channelId, 'messageId': messageId})
  await deleteMessage(channelId, messageId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
