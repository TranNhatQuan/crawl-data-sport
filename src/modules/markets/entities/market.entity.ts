import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Market' })
@Unique(['name', 'eventId'])
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

    @Column({ default: true })
    enabled: boolean

    @Column({ default: false })
    isTrending: boolean
}
