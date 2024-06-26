import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity({ name: 'Selection' })
@Unique(['name', 'marketId'])
export class Selection extends AppBaseEntity {
    @PrimaryGeneratedColumn('increment')
    selectionId: number

    @Column()
    marketId: number

    @Column({ length: 255 })
    marketType: string

    @Column({ length: 255 })
    name: string

    @Column({ length: 255 })
    role: string

    @Column({ type: 'float' })
    winPrice: number

    @Column({ default: true })
    enabled: boolean
}
