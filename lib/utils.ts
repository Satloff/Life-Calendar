import { DEFAULTS } from './constants'

// ============================================
// THEMES
// ============================================

/**
 * Available color themes for wallpapers
 */
export const themes = {
  /** Dark amber/orange theme */
  amber: { bg: '#1a1612', done: '#e89028', now: '#ff5500', future: '#5a4020', special: '#e84393' },
  /** Dark theme with white text */
  midnight: { bg: '#1a1a1a', done: '#ffffff', now: '#ff6b47', future: '#3d3d3d', special: '#00d9ff' },
  /** Light cream with blue accents */
  retro: { bg: '#f0ede6', done: '#3d5a9f', now: '#e63946', future: '#b8c4e0', special: '#9b59b6' },
  /** Light warm cream with dark text */
  terminal: { bg: '#d4cfc4', done: '#2a2a2a', now: '#c41e3a', future: '#a8a090', special: '#8e44ad' },
  /** Light paper-like with dark text */
  paper: { bg: '#f5f2eb', done: '#2d2d2d', now: '#e63946', future: '#d4d0c8', special: '#9b59b6' },
  /** Mustard orange with blue accents - vintage duck style */
  duck: { bg: '#d4a039', done: '#1a4a6e', now: '#0d3a5c', future: '#c49030', special: '#1a4a6e' },
  /** Cream/beige with blueprint blue */
  blueprint: { bg: '#e8e0d0', done: '#2a4a8a', now: '#1a3a7a', future: '#d8d0c0', special: '#8a2a4a' },
  /** Sage green with terracotta accents */
  sage: { bg: '#a8b8a8', done: '#8b4a3a', now: '#6a3a2a', future: '#98a898', special: '#3a6a8b' },
} as const

export type ThemeName = keyof typeof themes
export type Theme = (typeof themes)[ThemeName]

/** All theme names for random selection */
const THEME_NAMES = Object.keys(themes) as ThemeName[]

/**
 * Get a random theme name
 */
export function getRandomTheme(): ThemeName {
  return THEME_NAMES[Math.floor(Math.random() * THEME_NAMES.length)]
}

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get the day of year (1-366) for a given date
 * Uses UTC to avoid daylight saving time issues
 */
export function dayOfYear(d: Date): number {
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const startOfYear = Date.UTC(year, 0, 1)
  const currentDate = Date.UTC(year, month, day)
  return Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1
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
  birthdate: Date | null
}

/**
 * Parse a date string (YYYY-MM-DD) into a Date object in local time
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Parse URL query parameters for wallpaper generation
 */
export function getParams(url: string): WallpaperParams {
  const u = new URL(url)
  const birthdateParam = u.searchParams.get('birthdate')
  const dateParam = u.searchParams.get('date')
  const themeParam = u.searchParams.get('theme') || DEFAULTS.THEME
  
  // Handle "random" theme - pick a random theme each time
  const theme = themeParam === 'random' ? getRandomTheme() : themeParam as ThemeName
  
  return {
    width: parseInt(u.searchParams.get('width') || String(DEFAULTS.WIDTH)),
    height: parseInt(u.searchParams.get('height') || String(DEFAULTS.HEIGHT)),
    theme,
    date: dateParam ? parseLocalDate(dateParam) : new Date(),
    birthdate: birthdateParam ? parseLocalDate(birthdateParam) : null,
  }
}

/**
 * Check if a given month/day matches the birthday (ignoring year)
 */
export function isBirthday(month: number, day: number, birthdate: Date | null): boolean {
  if (!birthdate) return false
  return birthdate.getMonth() === month && birthdate.getDate() === day
}

/**
 * Get the day of year for a birthday in a given year
 */
export function birthdayDayOfYear(birthdate: Date | null, year: number): number | null {
  if (!birthdate) return null
  const birthdayThisYear = new Date(year, birthdate.getMonth(), birthdate.getDate())
  return dayOfYear(birthdayThisYear)
}

