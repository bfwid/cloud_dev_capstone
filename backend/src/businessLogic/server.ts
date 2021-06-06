import * as uuid from 'uuid'

import { ServerItem } from '../models/ServerItem'
import { ServerDao } from '../dataLayer/serverDao'
import { CreateServerRequest } from '../requests/server/CreateServerRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('server')

const serverDao = new ServerDao()

export async function createServer(createChannelRequest: CreateServerRequest
                                   ): Promise<ServerItem> {
  const serverId = uuid.v4()
  logger.info('Create new Server: ', {'serverId': serverId})

  const newServer: ServerItem = {
    serverId,
    ...createChannelRequest
  }

  return await serverDao.createServer(newServer)
}