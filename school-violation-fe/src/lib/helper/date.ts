import dayjs from './dayjs'

export const DATE_FORMAT = 'DD MMM YYYY, HH:mm'

export const minutesToDays = (mintues: number): string => {
  if (mintues < 0) {
    return '0 day(s) 0 hour(s)'
  }

  const timeDuration = dayjs.duration(mintues, 'minutes')

  const days = Math.floor(timeDuration.asDays())

  const hours = timeDuration.hours()

  return `${days} day(s) ${hours} hour(s)`
}
