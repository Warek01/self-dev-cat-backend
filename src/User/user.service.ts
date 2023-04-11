import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { string } from 'yup'

import type { UserCreateData } from '@/User/user.types'
import { FriendRequest, User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'
import { LogService } from '@/Log/log.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private _userRepo: Repository<User>,
    @InjectRepository(FriendRequest)
    private _friendRequestRepo: Repository<FriendRequest>,
    @Inject(forwardRef(() => EncryptionService))
    private _encryptionService: EncryptionService,
    @Inject(forwardRef(() => LogService))
    private _logService: LogService,
  ) {}

  public async create(data: UserCreateData): Promise<User> {
    if (
      (await this.findOneByEmail(data.email)) ||
      (await this.findOneByUsername(data.username))
    ) {
      throw new NotAcceptableException('Email already registered.')
    }

    if (await this.findOneByUsername(data.username)) {
      throw new NotAcceptableException('Username already taken.')
    }

    const user = await this._userRepo.create()
    user.email = data.email
    user.password = await this._encryptionService.encrypt(data.password)
    user.username = data.username
    user.createdAt = user.updatedAt = new Date()

    await this._userRepo.save(user)
    this._logService.user.new(user.username, user.email)

    return user
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this._userRepo.findOne({
      where: {
        email,
      },
    })
  }

  public async findOneByUsername(username: string): Promise<User | null> {
    return await this._userRepo.findOne({
      where: {
        username,
      },
    })
  }

  public async changePassword(email: string, newPass: string): Promise<User | null> {
    await string().min(5).max(255).required().validate(newPass)

    const user = await this.findOneByEmail(email)

    if (user) {
      user.password = await this._encryptionService.encrypt(newPass)
      await this._userRepo.save(user)
      this._logService.user.changeData(user.username, user.email, 'password')
    }

    return user
  }

  public async changeUsername(email: string, newUsername: string): Promise<User | null> {
    await string().min(1).max(255).required().validate(newUsername)

    const user = await this.findOneByEmail(email)

    if (user) {
      user.username = newUsername
      await this._userRepo.save(user)
      this._logService.user.changeData(user.username, user.email, 'username')
    }

    return user
  }

  public async changeRealName(email: string, newName: string): Promise<User | null> {
    await string().min(1).max(255).required().validate(newName)

    const user = await this.findOneByEmail(email)

    if (user !== null) {
      user.realName = newName
      await this._userRepo.save(user)
      this._logService.user.changeData(user.username, user.email, 'real_name')
    }

    return user
  }

  public async delete(username: string): Promise<void> {
    const user = await this.findOneByUsername(username)

    if (!user) {
      throw new NotFoundException()
    }

    await this._userRepo.delete({
      username,
    })

    this._logService.user.delete(user.username, user.email)
  }

  public async addFriend(username: string, friendUsername: string): Promise<void> {
    const user = await this.findOneByUsername(username)
    const friend = await this.findOneByUsername(friendUsername)

    if (!user) {
      throw new NotFoundException(`User ${username} not found`)
    }

    if (!friend) {
      throw new NotFoundException(`User ${friendUsername} not found`)
    }

    const existingRequest = await this._friendRequestRepo
      .createQueryBuilder('req')
      .where('req."fromId" = :userId', { userId: user.id })
      .andWhere('req."toId" = :friendId', { friendId: friend.id })
      .andWhere("req.status IN ('pending', 'accepted')")
      .getOne()

    if (existingRequest) {
      throw new ConflictException('Friend request already sent')
    }

    const request = this._friendRequestRepo.create()
    request.from = user
    request.to = friend
    request.status = 'pending'

    await this._friendRequestRepo.save(request)
    await this._logService.user.addFriend(user.username, friend.username)
  }

  public async removeFriend(): Promise<void> {}
}
