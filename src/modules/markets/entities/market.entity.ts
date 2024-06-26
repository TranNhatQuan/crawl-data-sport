import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Market' })
export class Market extends AppBaseEntity {
    @PrimaryGeneratedColumn('increment')
    marketId: number

    @Column({ length: 255 })
    eventId: string

    @Column({ length: 255 })
    marketType: string

    @Column({ length: 255 })
    name: string

    @Column()
    startTime: Date

    @Column()
    enabled: boolean
}
