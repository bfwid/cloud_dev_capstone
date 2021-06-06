import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ServerItem } from '../models/ServerItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
const logger = createLogger('serverDao')

// Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

export class ServerDao {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly serverTable = process.env.SERVER_TABLE) {
  }

  async createServer(serverItem: ServerItem): Promise<ServerItem> {
    logger.info('Creating new Server', {serverItem})
    const result = await this.docClient.put({
      TableName: this.serverTable,
      Item: serverItem
    }).promise()

    logger.info('Create Channel result ', result)

    return serverItem
  }
}
