import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Relation } from 'typeorm'

import { User } from '@/Entities'

@Entity()
export class UsefulResource {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  description: string

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.usefulResources, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User
}
