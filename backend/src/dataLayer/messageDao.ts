import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { MessageRequest } from '../requests/message/MessageRequest';
import { MessageItem } from '../models/MessageItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
const logger = createLogger('messageDao')

// Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

export class MessageDao {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly messageTable = process.env.MESSAGE_TABLE,
    private readonly messageCreatedAtIndex = process.env.MESSAGE_CREATEDAT_INDEX,
    private readonly region = process.env.REGION,
    private readonly bucket = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly imageBucket = process.env.IMAGE_S3_BUCKET,
    private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getAllMessageItems(channelId: string): Promise<MessageItem[]> {
    logger.info('Getting all Messages for ', {'channelId': channelId})

    const result = await this.docClient.query({
      TableName: this.messageTable,
      IndexName: this.messageCreatedAtIndex,
      KeyConditionExpression: 'channelId = :channelId',
      ExpressionAttributeValues: { ':channelId': channelId }
    }).promise()

    const items = result.Items

    logger.info('Number of Messages retrieved', {'channelId': channelId, 'count': items.length})

    return items as MessageItem[]
  }

  async messageExists(channelId: string, messageId: string) {
    const result = await this.docClient.get({
      TableName: this.messageTable,
      Key: {
        'channelId': channelId,
        'messageId': messageId
      }
    }).promise()
  
    logger.info('Message Exists Verification: ', {'result': result})
    return !!result.Item
  }

  async createMessage(messageItem: MessageItem): Promise<MessageItem> {
    logger.info('Creating new Message', {messageItem})
    const result = await this.docClient.put({
      TableName: this.messageTable,
      Item: messageItem
    }).promise()

    logger.info('Create Message result ', result)

    return messageItem
  }

  async getUploadUrl(messageId: string): Promise<string> {
    logger.info('Obtaining signed URL for ', {'messageId': messageId})
    const imgKey: string = messageId + '.png'

    const url = this.bucket.getSignedUrl(
      'putObject', {
          Bucket: this.imageBucket,
          Key: imgKey,
          Expires: parseInt(this.signedUrlExpiration)
      })
      
    logger.info('Signed URL for upload ', {'messageId': messageId, 'url': url})

    return url
  }

  async getMessageCreatedBy(channelId: string, messageId: string): Promise<string> {
    logger.info('Obtaining Creator of Message: ', {'channelId': channelId, 'messageId': messageId})
    const result = await this.docClient.get({
      TableName: this.messageTable,
      Key: {
        'channelId': channelId,
        'messageId': messageId
      }
    }).promise()

    let userId: string
    
    if(!!result.Item) {
      // User Record Exists, return Nickname
      const messageItem: MessageItem = result.Item as MessageItem
      userId = messageItem.createdBy
    }

    logger.info('Message Created By: ', {'userId': userId})
    return userId
  }

  async updateMessage(channelId: string, messageId: string, updatedMessage: MessageRequest) {
    logger.info('Updating Message ', {'channelId': channelId, 'messageId': messageId})
    
    const result = await this.docClient.update({
      TableName: this.messageTable,
      Key: {
        'channelId': channelId,
        'messageId': messageId
      },
      UpdateExpression: 'set #message = :message',
      ExpressionAttributeNames: {
        '#message': 'message'
      },
      ExpressionAttributeValues: {
        ':message': updatedMessage.message
      },
    }).promise()

    logger.info('Update Message Result ', result)
  }

  async deleteMessage(channelId: string, messageId: string) {
    logger.info('Deleting Message ', {'channelId': channelId, 'messageId': messageId})

    const result = await this.docClient.delete({
      TableName: this.messageTable,
      Key: {
        'channelId': channelId,
        'messageId': messageId
      }
    }).promise()

    logger.info('Delete Message Result ', result)
  }

  async uploadAttachment(channelId: string, messageId: string) {
    const url = 'https://' + this.imageBucket + '.s3.' + this.region + '.amazonaws.com/' + messageId + '.png'
    logger.info('Associating attachment ', {'channelId': channelId, 'messageId': messageId, 'url': url})

    const result = await this.docClient.update({
        TableName: this.messageTable,
        Key: {
          'channelId': channelId,
          'messageId': messageId
        },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
          '#attachmentUrl': 'attachmentUrl'
        },
        ExpressionAttributeValues: {
          ':attachmentUrl': url
        }
    }).promise()

    logger.info('Updated Message with attachment url ', result)
  }
}
