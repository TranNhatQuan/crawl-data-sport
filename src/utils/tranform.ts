import { TransformFnParams } from 'class-transformer'

export const ToNumber = (param: TransformFnParams) => {
    if (param.value && typeof param.value !== 'number') {
        const num = Number(param.value)
        return !isNaN(num) ? num : param.value
    }
    return param.value
}
