import { DEFAULTS } from './constants'

// ============================================
// THEMES
// ============================================

/**
 * Available color themes for wallpapers
 */
export const themes = {
  /** Dark amber/orange theme */
  amber: { bg: '#1a1612', done: '#e89028', now: '#ff5500', future: '#5a4020' },
  /** Dark theme with white text */
  midnight: { bg: '#1a1a1a', done: '#ffffff', now: '#ff6b47', future: '#3d3d3d' },
  /** Light cream with blue accents */
  retro: { bg: '#f0ede6', done: '#3d5a9f', now: '#e63946', future: '#b8c4e0' },
  /** Light warm cream with dark text */
  terminal: { bg: '#d4cfc4', done: '#2a2a2a', now: '#c41e3a', future: '#a8a090' },
  /** Light paper-like with dark text */
  paper: { bg: '#f5f2eb', done: '#2d2d2d', now: '#e63946', future: '#d4d0c8' },
} as const

export type ThemeName = keyof typeof themes
export type Theme = (typeof themes)[ThemeName]

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get the day of year (1-366) for a given date
 */
export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Get the number of days in a year (365 or 366 for leap years)
 */
export function daysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
}

/**
 * Get the number of days in a quarter (0-3)
 */
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

/**
 * Get the starting day of year for a quarter (0-3)
 */
export function quarterStartDay(quarter: number, year: number): number {
  let day = 1
  for (let q = 0; q < quarter; q++) {
    day += daysInQuarter(q, year)
  }
  return day
}

/**
 * Get the number of days in a month (0-11)
 */
export function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Calculate weeks lived since birth
 */
export function weeksAlive(birth: Date, now: Date): number {
  const diff = now.getTime() - birth.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
}

// ============================================
// QUERY PARAMS
// ============================================

export interface WallpaperParams {
  width: number
  height: number
  theme: ThemeName
  date: Date
  birthdate: Date
}

/**
 * Parse URL query parameters for wallpaper generation
 */
export function getParams(url: string): WallpaperParams {
  const u = new URL(url)
  return {
    width: parseInt(u.searchParams.get('width') || String(DEFAULTS.WIDTH)),
    height: parseInt(u.searchParams.get('height') || String(DEFAULTS.HEIGHT)),
    theme: (u.searchParams.get('theme') || DEFAULTS.THEME) as ThemeName,
    date: u.searchParams.get('date') ? new Date(u.searchParams.get('date')!) : new Date(),
    birthdate: u.searchParams.get('birthdate') 
      ? new Date(u.searchParams.get('birthdate')!) 
      : new Date(DEFAULTS.BIRTHDATE),
  }
}
