import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Event' })
export class Event extends AppBaseEntity {
    @PrimaryColumn()
    eventId: string

    @Column()
    leagueId: number

    @Column({ length: 255 })
    title: string

    @Column()
    startTime: Date

    @Column({ nullable: true })
    startedAt: Date

    @Column({ nullable: true })
    finishedAt: Date

    @Column({ default: true })
    enabled: boolean
}
