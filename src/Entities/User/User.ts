import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'

import UsefulResource from '@/Entities/UsefulResource'

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

  @Column({ type: 'date', nullable: false })
  createdAt: Date

  @Column({ type: 'date', nullable: false })
  updatedAt: Date

  @OneToMany(() => UsefulResource, (usefulResource) => usefulResource.user, {
    nullable: true,
  })
  usefulResources: Relation<UsefulResource>
}
