import { randomUUID } from 'crypto'

export const randomID = () => {
    return randomUUID().replace(/-/g, '')
}

export const CompareDateByDayMonthYear = (date1: Date, date2: Date) => {
    if (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    ) {
        return true
    }
    return false
}

export const filterDuplicates = (array: any[]) => {
    const set = new Set()
    const result = array.filter((item) => {
        const duplicate = set.has(item.name)
        set.add(item.name)
        return !duplicate
    })
    return result
}
