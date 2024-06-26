import { Expose, Transform } from 'class-transformer'

export class LaegueFromPriceKineticsDTO {
    @Expose()
    @Transform((value) => {
        return value.obj?.League
    })
    name: string

    @Expose()
    @Transform((value) => {
        return new Date(value.obj?.Sport)
    })
    sportId: string
}
