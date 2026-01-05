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
  /** Pink/rose theme */
  rose: { bg: '#1a1216', done: '#e890a8', now: '#ff4080', future: '#4a2035', special: '#00d9ff' },
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

/**
 * Check if today is the birthday
 */
export function isTodayBirthday(date: Date, birthdate: Date | null): boolean {
  if (!birthdate) return false
  return date.getMonth() === birthdate.getMonth() && date.getDate() === birthdate.getDate()
}

/**
 * Calculate age in years
 */
export function calculateAge(date: Date, birthdate: Date | null): number | null {
  if (!birthdate) return null
  let age = date.getFullYear() - birthdate.getFullYear()
  const monthDiff = date.getMonth() - birthdate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && date.getDate() < birthdate.getDate())) {
    age--
  }
  return age
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinalSuffix(n: number): string {
  const s = ['TH', 'ST', 'ND', 'RD']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// ============================================
// HOLIDAY EASTER EGGS
// ============================================

/**
 * Major holidays that show a banner across the wallpaper
 */
export const HOLIDAY_EASTER_EGGS = [
  { month: 0, day: 1, message: '✨ HAPPY 2026 ✨' },
  { month: 1, day: 14, message: '💕 HAPPY VALENTINE\'S 💕' },
  { month: 2, day: 17, message: '☘️ HAPPY ST. PATRICK\'S ☘️' },
  { month: 3, day: 1, message: '🃏 APRIL FOOLS 🃏' },
  { month: 6, day: 4, message: '🇺🇸 HAPPY 4TH 🇺🇸' },
  { month: 9, day: 31, message: '🎃 HAPPY HALLOWEEN 🎃' },
  { month: 10, day: 27, message: '🦃 HAPPY THANKSGIVING 🦃' },
  { month: 11, day: 24, message: '🎄 CHRISTMAS EVE 🎄' },
  { month: 11, day: 25, message: '🎄 MERRY CHRISTMAS 🎄' },
  { month: 11, day: 31, message: '🥂 HAPPY NEW YEAR 🥂' },
]

/**
 * Get the holiday easter egg for a given date, if any
 */
export function getHolidayEasterEgg(date: Date): { message: string } | null {
  const currentMonth = date.getMonth()
  const currentDay = date.getDate()

  for (const holiday of HOLIDAY_EASTER_EGGS) {
    if (holiday.month === currentMonth && holiday.day === currentDay) {
      return { message: holiday.message }
    }
  }
  return null
}

/**
 * Quirky holidays - one for each day of the year
 */
const QUIRKY_HOLIDAYS: Record<string, string> = {
  '1-1': "New Year's Day",
  '1-2': 'Science Fiction Day',
  '1-3': 'Festival of Sleep Day',
  '1-4': 'Trivia Day',
  '1-5': 'National Bird Day',
  '1-6': 'Bean Day',
  '1-7': 'Old Rock Day',
  '1-8': 'Bubble Bath Day',
  '1-9': 'Static Electricity Day',
  '1-10': 'Houseplant Day',
  '1-11': 'Step in a Puddle Day',
  '1-12': 'Marzipan Day',
  '1-13': 'Rubber Ducky Day',
  '1-14': 'Dress Up Your Pet Day',
  '1-15': 'Hat Day',
  '1-16': 'Appreciate a Dragon Day',
  '1-17': 'Ditch New Year Resolutions Day',
  '1-18': 'Winnie the Pooh Day',
  '1-19': 'Popcorn Day',
  '1-20': 'Cheese Lover Day',
  '1-21': 'Squirrel Appreciation Day',
  '1-22': "Answer Your Cat's Questions Day",
  '1-23': 'Pie Day',
  '1-24': 'Compliment Day',
  '1-25': 'Opposite Day',
  '1-26': 'Spouse Day',
  '1-27': 'Chocolate Cake Day',
  '1-28': 'Fun at Work Day',
  '1-29': 'Puzzle Day',
  '1-30': 'Croissant Day',
  '1-31': 'Backward Day',
  '2-1': 'Dark Chocolate Day',
  '2-2': 'Groundhog Day',
  '2-3': 'Carrot Cake Day',
  '2-4': 'Thank a Mail Carrier Day',
  '2-5': 'Nutella Day',
  '2-6': 'Chopsticks Day',
  '2-7': 'Send a Card Day',
  '2-8': 'Kite Flying Day',
  '2-9': 'Pizza Day',
  '2-10': 'Umbrella Day',
  '2-11': 'Make a Friend Day',
  '2-12': 'Plum Pudding Day',
  '2-13': 'Tortellini Day',
  '2-14': "Valentine's Day",
  '2-15': 'Gumdrop Day',
  '2-16': 'Do a Grouch a Favor Day',
  '2-17': 'Random Acts of Kindness Day',
  '2-18': 'Drink Wine Day',
  '2-19': 'Chocolate Mint Day',
  '2-20': 'Love Your Pet Day',
  '2-21': 'Sticky Bun Day',
  '2-22': 'Be Humble Day',
  '2-23': 'Banana Bread Day',
  '2-24': 'Tortilla Chip Day',
  '2-25': 'Clam Chowder Day',
  '2-26': 'Tell a Fairy Tale Day',
  '2-27': 'Strawberry Day',
  '2-28': 'Tooth Fairy Day',
  '2-29': 'Leap Day',
  '3-1': 'Peanut Butter Lover Day',
  '3-2': 'Read Across America Day',
  '3-3': 'I Want You to Be Happy Day',
  '3-4': 'Grammar Day',
  '3-5': 'Cheese Doodle Day',
  '3-6': 'Dentist Day',
  '3-7': 'Cereal Day',
  '3-8': 'Proofreading Day',
  '3-9': 'Get Over It Day',
  '3-10': 'Pack Your Lunch Day',
  '3-11': 'Napping Day',
  '3-12': 'Plant a Flower Day',
  '3-13': 'Coconut Torte Day',
  '3-14': 'Pi Day',
  '3-15': 'Everything You Think is Wrong Day',
  '3-16': 'Panda Day',
  '3-17': "St. Patrick's Day",
  '3-18': 'Awkward Moments Day',
  '3-19': 'Poultry Day',
  '3-20': 'Happiness Day',
  '3-21': 'Common Courtesy Day',
  '3-22': 'Goof Off Day',
  '3-23': 'Puppy Day',
  '3-24': 'Cheesesteak Day',
  '3-25': 'Waffle Day',
  '3-26': 'Spinach Day',
  '3-27': 'Whiskey Day',
  '3-28': 'Something on a Stick Day',
  '3-29': 'Mom and Pop Business Day',
  '3-30': 'Take a Walk in the Park Day',
  '3-31': 'Crayon Day',
  '4-1': "April Fools' Day",
  '4-2': 'Peanut Butter and Jelly Day',
  '4-3': 'Chocolate Mousse Day',
  '4-4': 'Vitamin C Day',
  '4-5': 'Deep Dish Pizza Day',
  '4-6': 'Caramel Popcorn Day',
  '4-7': 'No Housework Day',
  '4-8': 'Zoo Lovers Day',
  '4-9': 'Unicorn Day',
  '4-10': 'Siblings Day',
  '4-11': 'Pet Day',
  '4-12': 'Grilled Cheese Day',
  '4-13': 'Scrabble Day',
  '4-14': 'Dolphin Day',
  '4-15': 'Rubber Eraser Day',
  '4-16': 'Eggs Benedict Day',
  '4-17': 'Haiku Day',
  '4-18': 'High Five Day',
  '4-19': 'Garlic Day',
  '4-20': 'Look Alike Day',
  '4-21': 'Kindergarten Day',
  '4-22': 'Earth Day',
  '4-23': 'Picnic Day',
  '4-24': 'Pig in a Blanket Day',
  '4-25': 'Telephone Day',
  '4-26': 'Pretzel Day',
  '4-27': 'Tell a Story Day',
  '4-28': 'Superhero Day',
  '4-29': 'Zipper Day',
  '4-30': 'Honesty Day',
  '5-1': 'May Day',
  '5-2': 'Truffle Day',
  '5-3': 'Lumpy Rug Day',
  '5-4': 'Star Wars Day',
  '5-5': 'Cinco de Mayo',
  '5-6': 'Crepe Suzette Day',
  '5-7': 'Cosmopolitan Day',
  '5-8': 'No Socks Day',
  '5-9': 'Butterscotch Brownie Day',
  '5-10': 'Clean Up Your Room Day',
  '5-11': 'Eat What You Want Day',
  '5-12': 'Limerick Day',
  '5-13': 'Frog Jumping Day',
  '5-14': 'Dance Like a Chicken Day',
  '5-15': 'Chocolate Chip Day',
  '5-16': 'Biographers Day',
  '5-17': 'Pack Rat Day',
  '5-18': 'No Dirty Dishes Day',
  '5-19': 'Devil Food Cake Day',
  '5-20': 'Be a Millionaire Day',
  '5-21': 'Waitstaff Day',
  '5-22': 'Buy a Musical Instrument Day',
  '5-23': 'Lucky Penny Day',
  '5-24': 'Scavenger Hunt Day',
  '5-25': 'Towel Day',
  '5-26': 'Blueberry Cheesecake Day',
  '5-27': 'Grape Popsicle Day',
  '5-28': 'Hamburger Day',
  '5-29': 'Biscuit Day',
  '5-30': 'Mint Julep Day',
  '5-31': 'Macaroon Day',
  '6-1': 'Flip a Coin Day',
  '6-2': 'Rocky Road Day',
  '6-3': 'Donut Day',
  '6-4': 'Cheese Day',
  '6-5': 'Hot Air Balloon Day',
  '6-6': 'Yo-Yo Day',
  '6-7': 'Chocolate Ice Cream Day',
  '6-8': 'Best Friends Day',
  '6-9': 'Donald Duck Day',
  '6-10': 'Iced Tea Day',
  '6-11': 'German Chocolate Cake Day',
  '6-12': 'Peanut Butter Cookie Day',
  '6-13': 'Sewing Machine Day',
  '6-14': 'Bourbon Day',
  '6-15': 'Nature Photography Day',
  '6-16': 'Fudge Day',
  '6-17': 'Eat Your Vegetables Day',
  '6-18': 'Picnic Day',
  '6-19': 'Martini Day',
  '6-20': 'Ice Cream Soda Day',
  '6-21': 'Selfie Day',
  '6-22': 'Onion Rings Day',
  '6-23': 'Pink Day',
  '6-24': 'Pralines Day',
  '6-25': 'Catfish Day',
  '6-26': 'Chocolate Pudding Day',
  '6-27': 'Sunglasses Day',
  '6-28': 'Tapioca Day',
  '6-29': 'Waffle Iron Day',
  '6-30': 'Meteor Watch Day',
  '7-1': 'Postal Worker Day',
  '7-2': 'UFO Day',
  '7-3': 'Compliment Your Mirror Day',
  '7-4': 'Independence Day',
  '7-5': 'Bikini Day',
  '7-6': 'Fried Chicken Day',
  '7-7': 'Strawberry Sundae Day',
  '7-8': 'Video Games Day',
  '7-9': 'Sugar Cookie Day',
  '7-10': 'Piña Colada Day',
  '7-11': 'Mojito Day',
  '7-12': 'Pecan Pie Day',
  '7-13': 'French Fries Day',
  '7-14': 'Shark Awareness Day',
  '7-15': 'Gummy Worm Day',
  '7-16': 'Ice Cream Day',
  '7-17': 'World Emoji Day',
  '7-18': 'Caviar Day',
  '7-19': 'Daiquiri Day',
  '7-20': 'Moon Day',
  '7-21': 'Junk Food Day',
  '7-22': 'Hammock Day',
  '7-23': 'Hot Dog Day',
  '7-24': 'Tequila Day',
  '7-25': 'Wine and Cheese Day',
  '7-26': 'All or Nothing Day',
  '7-27': 'Scotch Day',
  '7-28': 'Milk Chocolate Day',
  '7-29': 'Lasagna Day',
  '7-30': 'Cheesecake Day',
  '7-31': 'Avocado Day',
  '8-1': 'Raspberry Cream Pie Day',
  '8-2': 'Ice Cream Sandwich Day',
  '8-3': 'Watermelon Day',
  '8-4': 'Chocolate Chip Cookie Day',
  '8-5': 'Underwear Day',
  '8-6': 'Root Beer Float Day',
  '8-7': 'Lighthouse Day',
  '8-8': 'Cat Day',
  '8-9': 'Book Lovers Day',
  '8-10': "S'mores Day",
  '8-11': 'Hip Hop Day',
  '8-12': 'Vinyl Day',
  '8-13': 'Left Handers Day',
  '8-14': 'Creamsicle Day',
  '8-15': 'Relaxation Day',
  '8-16': 'Tell a Joke Day',
  '8-17': 'Thrift Shop Day',
  '8-18': 'Mail Order Catalog Day',
  '8-19': 'Aviation Day',
  '8-20': 'Lemonade Day',
  '8-21': 'Senior Citizens Day',
  '8-22': 'Tooth Fairy Day',
  '8-23': 'Cuban Sandwich Day',
  '8-24': 'Waffle Day',
  '8-25': 'Banana Split Day',
  '8-26': 'Dog Day',
  '8-27': 'Just Because Day',
  '8-28': 'Cherry Turnovers Day',
  '8-29': 'Chop Suey Day',
  '8-30': 'Toasted Marshmallow Day',
  '8-31': 'Eat Outside Day',
  '9-1': 'Ginger Cat Appreciation Day',
  '9-2': 'Blueberry Popsicle Day',
  '9-3': 'Skyscraper Day',
  '9-4': 'Macadamia Nut Day',
  '9-5': 'Cheese Pizza Day',
  '9-6': 'Read a Book Day',
  '9-7': 'Beer Lovers Day',
  '9-8': 'International Literacy Day',
  '9-9': 'Teddy Bear Day',
  '9-10': 'Swap Ideas Day',
  '9-11': 'Make Your Bed Day',
  '9-12': 'Chocolate Milkshake Day',
  '9-13': 'Positive Thinking Day',
  '9-14': 'Cream-Filled Donut Day',
  '9-15': 'Online Learning Day',
  '9-16': 'Cinnamon Raisin Bread Day',
  '9-17': 'Apple Dumpling Day',
  '9-18': 'Cheeseburger Day',
  '9-19': 'Talk Like a Pirate Day',
  '9-20': 'Punch Day',
  '9-21': 'Miniature Golf Day',
  '9-22': 'Ice Cream Cone Day',
  '9-23': 'Dogs in Politics Day',
  '9-24': 'Punctuation Day',
  '9-25': 'Comic Book Day',
  '9-26': 'Pancake Day',
  '9-27': 'Chocolate Milk Day',
  '9-28': 'Drink Beer Day',
  '9-29': 'Coffee Day',
  '9-30': 'Chewing Gum Day',
  '10-1': 'Homemade Cookies Day',
  '10-2': 'Name Your Car Day',
  '10-3': 'Boyfriend Day',
  '10-4': 'Taco Day',
  '10-5': 'Do Something Nice Day',
  '10-6': 'Noodle Day',
  '10-7': 'Frappe Day',
  '10-8': 'Pierogi Day',
  '10-9': 'Beer and Pizza Day',
  '10-10': 'Cake Decorating Day',
  '10-11': 'Sausage Pizza Day',
  '10-12': 'Gumbo Day',
  '10-13': 'Train Your Brain Day',
  '10-14': 'Dessert Day',
  '10-15': 'Mushroom Day',
  '10-16': 'Boss Day',
  '10-17': 'Pasta Day',
  '10-18': 'No Beard Day',
  '10-19': 'Seafood Bisque Day',
  '10-20': 'Brandied Fruit Day',
  '10-21': 'Pumpkin Cheesecake Day',
  '10-22': 'Nut Day',
  '10-23': 'Boston Cream Pie Day',
  '10-24': 'Bologna Day',
  '10-25': 'Greasy Foods Day',
  '10-26': 'Pumpkin Day',
  '10-27': 'Black Cat Day',
  '10-28': 'Chocolate Day',
  '10-29': 'Oatmeal Day',
  '10-30': 'Candy Corn Day',
  '10-31': 'Caramel Apple Day',
  '11-1': 'Vinegar Day',
  '11-2': 'Deviled Egg Day',
  '11-3': 'Sandwich Day',
  '11-4': 'Candy Day',
  '11-5': 'Doughnut Day',
  '11-6': 'Nachos Day',
  '11-7': 'Bittersweet Chocolate Day',
  '11-8': 'Cappuccino Day',
  '11-9': 'Scrapbook Day',
  '11-10': 'Vanilla Cupcake Day',
  '11-11': 'Origami Day',
  '11-12': 'Pizza with the Works Day',
  '11-13': 'Sadie Hawkins Day',
  '11-14': 'Spicy Guacamole Day',
  '11-15': 'Clean Out Your Refrigerator Day',
  '11-16': 'Button Day',
  '11-17': 'Homemade Bread Day',
  '11-18': 'Mickey Mouse Day',
  '11-19': 'Carbonated Beverage Day',
  '11-20': 'Absurdity Day',
  '11-21': 'Stuffing Day',
  '11-22': 'Go For a Ride Day',
  '11-23': 'Espresso Day',
  '11-24': 'Sardine Day',
  '11-25': 'Parfait Day',
  '11-26': 'Cake Day',
  '11-27': 'Bavarian Cream Pie Day',
  '11-28': 'French Toast Day',
  '11-29': 'Lemon Cream Pie Day',
  '11-30': 'Mousse Day',
  '12-1': 'Pie Day',
  '12-2': 'Fritter Day',
  '12-3': 'Roof Over Your Head Day',
  '12-4': 'Cookie Day',
  '12-5': 'Comfort Food Day',
  '12-6': 'Microwave Oven Day',
  '12-7': 'Cotton Candy Day',
  '12-8': 'Brownie Day',
  '12-9': 'Pastry Day',
  '12-10': 'Dewey Decimal Day',
  '12-11': 'Noodle Ring Day',
  '12-12': 'Poinsettia Day',
  '12-13': 'Cocoa Day',
  '12-14': 'Monkey Day',
  '12-15': 'Cupcake Day',
  '12-16': 'Chocolate Covered Anything Day',
  '12-17': 'Maple Syrup Day',
  '12-18': 'Bake Cookies Day',
  '12-19': 'Oatmeal Muffin Day',
  '12-20': 'Sangria Day',
  '12-21': 'Humbug Day',
  '12-22': 'Cookie Exchange Day',
  '12-23': 'Pfeffernusse Day',
  '12-24': 'Eggnog Day',
  '12-25': 'Pumpkin Pie Day',
  '12-26': 'Candy Cane Day',
  '12-27': 'Fruitcake Day',
  '12-28': 'Card Playing Day',
  '12-29': 'Pepper Pot Day',
  '12-30': 'Bacon Day',
  '12-31': "New Year's Eve",
}

/**
 * Get the quirky holiday for a given date
 */
export function getQuirkyHoliday(date: Date): string | null {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const key = `${month}-${day}`
  return QUIRKY_HOLIDAYS[key] || null
}

