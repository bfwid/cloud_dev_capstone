import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'
import { getUserNickname } from '../../../businessLogic/user'

const logger = createLogger('getUserNickname')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId: string = getUserId(event)
  logger.info("Request received to retrieve all Nickname for User: ", userId)

  const nickname: string = await getUserNickname(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      nickname
    })
  }
}
