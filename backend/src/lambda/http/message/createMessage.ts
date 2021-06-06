import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { MessageRequest } from '../../../requests/message/MessageRequest'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'
import { createMessage } from '../../../businessLogic/message'
import { channelExists } from '../../../businessLogic/channel'

const logger = createLogger('createMessage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newMessage: MessageRequest = JSON.parse(event.body)
  const channelId = event.pathParameters.channelId
  const userId: string = getUserId(event)
  logger.info("Received request to create a Message: ", {newMessage})
  logger.info("Current User and Channel: ", {'userId': userId, 'channelId': channelId})

  const validChannel = await channelExists(channelId)
  if(!validChannel) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Channel not found'
      })
    }
  }

  const newMessageItem = await createMessage(newMessage, channelId, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newMessageItem
    })
  }
}
