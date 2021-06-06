import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ChannelItem } from '../models/ChannelItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
const logger = createLogger('channelDao')

// Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

export class ChannelDao {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly channelTable = process.env.CHANNEL_TABLE,
    private readonly channelCreatedAtIndex = process.env.CHANNEL_CREATEDAT_INDEX) {
  }

  async getAllChannelItems(serverId: string): Promise<ChannelItem[]> {
    logger.info('Getting all Channels')
    const result = await this.docClient.query({
      TableName: this.channelTable,
      IndexName: this.channelCreatedAtIndex,
      KeyConditionExpression: 'serverId = :serverId',
      ExpressionAttributeValues: { ':serverId': serverId }
    }).promise()

    const items = result.Items

    logger.info('Number of Channels retrieved', {'count': items.length})

    return items as ChannelItem[]
  }
  

  async channelExists(channelId: string) {
    const result = await this.docClient.scan({
      TableName: this.channelTable,
      FilterExpression: '#channelId = :channelId',
      ExpressionAttributeNames: {
        '#channelId': 'channelId'
      },
      ExpressionAttributeValues: {
        ':channelId': channelId
      },
      Limit: 1
    }).promise()
  
    logger.info('Channel Exists Verification: ', {'result': result})
    return result.Count > 0
  }

  async createChannel(channelItem: ChannelItem): Promise<ChannelItem> {
    logger.info('Creating new Channel', {channelItem})
    const result = await this.docClient.put({
      TableName: this.channelTable,
      Item: channelItem
    }).promise()

    logger.info('Create Channel result ', result)

    return channelItem
  }
}
