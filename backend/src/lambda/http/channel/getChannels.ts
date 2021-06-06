import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../../utils/logger'
import { getAllChannelItems } from '../../../businessLogic/channel'

const logger = createLogger('getChannels')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const serverId = event.pathParameters.serverId
  logger.info("Request received to retrieve all Channels: ", {'serverId': serverId})

  const channelItems = await getAllChannelItems(serverId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: channelItems
    })
  }
}
