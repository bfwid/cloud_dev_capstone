import { UserItem } from '../models/UserItem'
import { UserDao } from '../dataLayer/userDao'
import { UserRequest } from '../requests/user/UserRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('user')

const userDao = new UserDao()

export async function getUserNickname(userId): Promise<string> {
  logger.info('Obtaining Nickname for ', userId)
  return userDao.getUserNickname(userId)
}

export async function setUserNickname(userRequest: UserRequest,
                                     userId: string
                                    ): Promise<UserItem> {
  logger.info('Starting User Nickname Request: ', {'userRequest': userRequest})
  
  const exists = userDao.userExists(userId)
  const userItem: UserItem = {
    userId,
    ...userRequest
  }

  if(exists) {
    logger.info('User Nickname found, updating ', userId)
    return await userDao.updateUserNickname(userItem)
  }
  else {
    logger.info('User Nickname not found, creating ', userId)
    return await userDao.createUserNickname(userItem)
  }
}