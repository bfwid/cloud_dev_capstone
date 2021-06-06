import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateServerRequest } from '../../../requests/server/CreateServerRequest'
import { createLogger } from '../../../utils/logger'
import { createServer } from '../../../businessLogic/server'

const logger = createLogger('createServer')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newServer: CreateServerRequest = JSON.parse(event.body)
  logger.info("Received request to create a Server: ", {newServer})

  const newServeritem = await createServer(newServer)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newServeritem
    })
  }
}
