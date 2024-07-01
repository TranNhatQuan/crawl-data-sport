import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Selection' })
export class Selection extends AppBaseEntity {
    @PrimaryColumn()
    marketId: number

    @PrimaryColumn()
    name: string

    @Column({ length: 255 })
    role: string

    @Column({ type: 'float' })
    winPrice: number

    @Column({ default: true })
    enabled: boolean
}
