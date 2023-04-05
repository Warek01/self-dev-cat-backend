import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import User from '@/Entities/User/User'

@Entity()
export default class Log {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  type: string

  @OneToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user?: User

  @Column({ type: 'varchar', nullable: true })
  username?: string

  @Column({ type: 'varchar', nullable: true })
  description?: string

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  date: Date
}
