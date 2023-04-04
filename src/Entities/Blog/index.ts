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
    type: 'datetime',
    nullable: false,
    default: () => new Date(),
  })
  createdAt: Date

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => new Date(),
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
