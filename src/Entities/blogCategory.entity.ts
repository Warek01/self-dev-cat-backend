import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Blog } from '@/Entities/blog.entity'

@Entity()
export class BlogCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  slug: string

  @Column({ type: 'varchar', nullable: false })
  title: string

  @ManyToMany(() => Blog, (blog) => blog.categories)
  blogs: Blog[]
}
