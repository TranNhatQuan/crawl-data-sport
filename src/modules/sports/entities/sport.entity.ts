import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Sport' })
export class Sport extends AppBaseEntity {
    @PrimaryColumn()
    sportId: string

    @Column({ length: 255 })
    name: string

    @Column({ default: true })
    enabled: boolean
}
