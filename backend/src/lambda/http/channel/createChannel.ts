import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateChannelRequest } from '../../../requests/channel/CreateChannelRequest'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'
import { createChannel } from '../../../businessLogic/channel'

const logger = createLogger('createChannel')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const serverId = event.pathParameters.serverId
  const newChannel: CreateChannelRequest = JSON.parse(event.body)
  const userId: string = getUserId(event)
  logger.info("Received request to create a Channel: ", {newChannel})
  logger.info("Current Server and User: ", {'serverId': serverId, 'userId': userId})

  const newChannelItem = await createChannel(newChannel, serverId, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newChannelItem
    })
  }
}
