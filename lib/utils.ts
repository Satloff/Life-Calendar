// ============================================
// THEMES
// ============================================

export const themes = {
  midnight: { bg: '#1a1a1a', done: '#ffffff', now: '#ff6b47', future: '#3d3d3d' },
  paper: { bg: '#f5f2eb', done: '#2d2d2d', now: '#e63946', future: '#d4d0c8' },
} as const

export type ThemeName = keyof typeof themes
export type Theme = (typeof themes)[ThemeName]

// ============================================
// DATE HELPERS
// ============================================

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function daysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
}

export function daysInQuarter(quarter: number, year: number): number {
  const months = [
    [31, 28, 31], // Q1: Jan, Feb, Mar
    [30, 31, 30], // Q2: Apr, May, Jun
    [31, 31, 30], // Q3: Jul, Aug, Sep
    [31, 30, 31], // Q4: Oct, Nov, Dec
  ]
  const isLeap = daysInYear(year) === 366
  const days = months[quarter].reduce((a, b) => a + b, 0)
  return quarter === 0 && isLeap ? days + 1 : days
}

export function quarterStartDay(quarter: number, year: number): number {
  let day = 1
  for (let q = 0; q < quarter; q++) {
    day += daysInQuarter(q, year)
  }
  return day
}

export function weeksAlive(birth: Date, now: Date): number {
  const diff = now.getTime() - birth.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
}

// ============================================
// QUERY PARAMS
// ============================================

export function getParams(url: string) {
  const u = new URL(url)
  return {
    width: parseInt(u.searchParams.get('width') || '1179'),
    height: parseInt(u.searchParams.get('height') || '2556'),
    theme: (u.searchParams.get('theme') || 'midnight') as ThemeName,
    date: u.searchParams.get('date') ? new Date(u.searchParams.get('date')!) : new Date(),
    birthdate: u.searchParams.get('birthdate') ? new Date(u.searchParams.get('birthdate')!) : new Date('1990-01-01'),
  }
}

