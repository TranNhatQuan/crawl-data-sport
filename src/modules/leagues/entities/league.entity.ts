import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'League' })
export class League extends AppBaseEntity {
    @PrimaryGeneratedColumn('increment')
    leagueId: number

    @Column({ length: 255 })
    name: string

    @Column({ length: 255 })
    sportId: string

    @Column({ default: true })
    enabled: boolean
}
