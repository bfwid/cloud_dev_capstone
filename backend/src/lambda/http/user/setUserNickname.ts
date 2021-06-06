import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UserRequest } from '../../../requests/user/UserRequest'
import { createLogger } from '../../../utils/logger'
import { getUserId } from '../../utils'
import { setUserNickname } from '../../../businessLogic/user'

const logger = createLogger('setUserNickname')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newUser: UserRequest = JSON.parse(event.body)
  const userId: string = getUserId(event)
  logger.info("Received request to set a User Nickname: ", {newUser})
  logger.info("Current User: ", {'userId': userId})

  const newUserItem = await setUserNickname(newUser, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newUserItem
    })
  }
}
