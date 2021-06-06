import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../../utils/logger'
import { channelExists } from '../../../businessLogic/channel'
import { getUploadUrl, messageExists, uploadAttachment } from '../../../businessLogic/message'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const channelId = event.pathParameters.channelId
  const messageId = event.pathParameters.messageId

  if(!channelId || !messageId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Missing parameters' 
      })
    }
  }

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

  logger.info('Adding URL to ', {'channelId': channelId, 'messageId': messageId})

  const signedUrl: string = await getUploadUrl(messageId)
  logger.info('Retrieved Signed URL ', {'signedUrl': signedUrl})

  await uploadAttachment(channelId, messageId)
  logger.info('Attachment uploaded ', {'channelId': channelId, 'messageId': messageId, 'signedUrl': signedUrl})
    
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
