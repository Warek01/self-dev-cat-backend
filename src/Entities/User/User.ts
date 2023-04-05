import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import UsefulResource from '@/Entities/UsefulResource'
import FriendRequest from '@/Entities/FriendRequest'

@Entity()
export default class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  username: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ type: 'varchar', nullable: true })
  realName?: string

  @Column({ type: 'varchar', nullable: false })
  email: string

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToMany(() => UsefulResource, (usefulResource) => usefulResource.user, {
    nullable: true,
  })
  usefulResources: Relation<UsefulResource>

  @OneToMany(() => FriendRequest, (req) => req.from, { nullable: true })
  friendRequests: Relation<FriendRequest[]>

  @ManyToMany(() => User, (user) => user.friends, { nullable: true })
  friends: Relation<User[]>
}
