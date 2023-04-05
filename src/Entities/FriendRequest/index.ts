import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { User } from '@/Entities'

@Entity()
export default class FriendRequest {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  from: Relation<User>

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  to: Relation<User>

  @Column({ type: 'bool', default: false })
  accepted: boolean
}
