import { Expose, Transform } from 'class-transformer'

export class SelectionFromPriceKineticsDTO {
    @Expose()
    @Transform((value) => {
        return value.obj?.Name
    })
    name: string

    @Expose()
    @Transform((value) => {
        return value.obj?.Role
    })
    role: string

    @Expose()
    @Transform((value) => {
        return Number(value.obj?.WinPrice)
    })
    winPrice: number
}
