/**
 * Layout constants for wallpaper generation
 * Designed for iPhone lock screen with safe zones for clock and home indicator
 */
export const LAYOUT = {
  /** Top padding as percentage of height (safe zone for clock) */
  TOP_PADDING: 0.28,
  /** Bottom padding as percentage of height (safe zone for home indicator) */
  BOTTOM_PADDING: 0.148,
  /** Available content height as percentage (1 - TOP - BOTTOM) */
  CONTENT_HEIGHT: 0.572,
  /** Footer height as percentage of total height */
  FOOTER_HEIGHT: 0.035,
  /** Title font size as percentage of height */
  TITLE_FONT_SIZE: 0.014,
  /** Footer font size as percentage of height */
  FOOTER_FONT_SIZE: 0.0144,
  /** Side padding in pixels */
  SIDE_PADDING: 10,
} as const

/**
 * Default wallpaper dimensions (iPhone 16/15/15 Pro/14 Pro)
 */
export const DEFAULTS = {
  WIDTH: 1179,
  HEIGHT: 2556,
  THEME: 'amber',
  BIRTHDATE: '1990-01-01',
  LIFESPAN: 90,
} as const

/**
 * Font configuration
 */
export const FONT = {
  NAME: 'DepartureMono',
  PATH: '/fonts/DepartureMono-Regular.otf',
} as const

