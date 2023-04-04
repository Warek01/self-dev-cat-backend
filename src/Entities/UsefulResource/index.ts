import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
} from 'typeorm'

import User from '@/Entities/User/User'

@Entity()
export default class UsefulResource {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  description: string

  @Column({ type: 'date', nullable: false })
  createdAt: Date

  @Column({ type: 'date', nullable: false })
  updatedAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  user: Relation<User>
}
