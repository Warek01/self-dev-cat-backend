import type { Request } from 'express'

import type { User } from '@/Entities'

export default interface RequestWithUser extends Request {
  user: Omit<User, 'password'>
}
