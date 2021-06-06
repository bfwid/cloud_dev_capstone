import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserItem } from '../models/UserItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
const logger = createLogger('userDao')

// Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

export class UserDao {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly userTable = process.env.USER_TABLE) {
  }

  async userExists(userId: string) {
    const result = await this.docClient.get({
      TableName: this.userTable,
      Key: {
        'userId': userId
      }
    }).promise()
  
    logger.info('User Exists Verification: ', {'result': result})
    return !!result.Item
  }

  async getUserNickname(userId: string): Promise<string> {
    logger.info('Obtaining User Nickname: ', {'userId': userId})
    const result = await this.docClient.get({
      TableName: this.userTable,
      Key: {
        'userId': userId
      }
    }).promise()

    let nickname = userId;
    
    if(!!result.Item) {
      // User Record Exists, return Nickname
      const userItem: UserItem = result.Item as UserItem
      nickname = userItem.nickname
    }

    logger.info('User Nickname: ', {'userId': userId, 'nickname': nickname})
    return nickname
  }

  async createUserNickname(userItem: UserItem): Promise<UserItem> {
    logger.info('Creating new User Details', {userItem})
    const result = await this.docClient.put({
      TableName: this.userTable,
      Item: userItem
    }).promise()

    logger.info('Create User Nickname result ', result)
    return userItem
  }

  async updateUserNickname(userItem: UserItem) {
    logger.info('Updating User Details ', {'userItem': userItem})
    const result = await this.docClient.update({
        TableName: this.userTable,
        Key: {
          'userId': userItem.userId
        },
        UpdateExpression: 'set #nickname = :nickname',
        ExpressionAttributeNames: {
          '#nickname': 'nickname'
        },
        ExpressionAttributeValues: {
          ':nickname': userItem.nickname
        },
    }).promise()
  
    logger.info('Update User Result ', result)
    return userItem
  }

}

