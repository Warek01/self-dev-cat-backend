import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User, BlogCategory } from '@/Entities'

@Entity()
export class Blog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  content: string

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  references?: {
    href: string
    text: string
  }[]

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: User

  @ManyToMany(() => BlogCategory, (category) => category.blogs, { onDelete: 'SET NULL' })
  @JoinTable()
  categories: BlogCategory[]

  @Column({ type: 'varchar', nullable: false })
  slug: string
}
