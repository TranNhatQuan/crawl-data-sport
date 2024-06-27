import { Expose, Transform } from 'class-transformer'

export class LeagueFromPriceKineticsDTO {
    @Expose()
    @Transform((value) => {
        return value.obj?.League
    })
    name: string

    @Expose()
    @Transform((value) => {
        return value.obj?.Sport
    })
    sportId: string
}
