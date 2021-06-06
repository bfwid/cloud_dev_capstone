import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../../utils/logger'
import { getAllMessageItems } from '../../../businessLogic/message'
import { channelExists } from '../../../businessLogic/channel'

const logger = createLogger('getChannels')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const channelId = event.pathParameters.channelId
  logger.info("Request received to retrieve all Messages for Channel: ", channelId)

  const validChannel = await channelExists(channelId)
  if(!validChannel) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Channel not found'
      })
    }
  }

  const messageItems = await getAllMessageItems(channelId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: messageItems
    })
  }
}
