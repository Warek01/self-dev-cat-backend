import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import { BlogReference } from '@/Entities/Blog/interface'
import { User } from '@/Entities'
import BlogCategory from '@/Entities/BlogCategory'

@Entity()
export default class Blog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  content: string

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  references?: BlogReference[]

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
  user: Relation<User>

  @ManyToMany(() => BlogCategory, (category) => category.blogs, { onDelete: 'SET NULL' })
  @JoinTable()
  categories: Relation<BlogCategory[]>

  @Column({ type: 'varchar', nullable: false })
  slug: string
}
