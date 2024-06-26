import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class AppBaseEntity extends BaseEntity {
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
