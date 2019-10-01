import moment from 'moment-timezone'
import { curry, pathOr, sort } from 'ramda';

export function formatTime(time: number): string {
  const date = new Date(time)
  return time ? moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a") : `n/a`
}

function sortByDateFunc<T>(fieldName: string, l: T[]): T[] {
  const sortBy = (a: T, b: T) => pathOr(0, [fieldName], a) - pathOr(0, [fieldName], b)
  return sort(sortBy, l)
}

//@ts-ignore
export const sortByDate = curry<T, T>(sortByDateFunc)