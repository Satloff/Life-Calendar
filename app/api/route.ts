import { NextResponse } from 'next/server'

export const runtime = 'edge'

const DOCS = {
  name: 'Life Calendar API',
  description: 'Generate dynamic wallpapers to track your year and life progress',
  baseUrl: 'https://life-cal-theo.vercel.app',
  endpoints: {
    '/api/days': {
      description: 'Year progress as a grid of 365 days',
      example: '/api/days?width=1206&height=2622&theme=amber',
    },
    '/api/months': {
      description: 'Year progress as 12 monthly grids (4×3 layout)',
      example: '/api/months?width=1206&height=2622&theme=midnight',
    },
    '/api/quarters': {
      description: 'Year progress as 4 quarterly grids (2×2 layout)',
      example: '/api/quarters?width=1206&height=2622&theme=retro',
    },
    '/api/life': {
      description: 'Life progress as weeks until age 90',
      example: '/api/life?width=1206&height=2622&theme=sage&birthdate=1990-01-15',
    },
  },
  parameters: {
    width: { type: 'number', default: 1179, description: 'Image width in pixels' },
    height: { type: 'number', default: 2556, description: 'Image height in pixels' },
    theme: {
      type: 'string',
      default: 'amber',
      description: 'Color theme',
      options: ['amber', 'midnight', 'retro', 'terminal', 'paper', 'duck', 'blueprint', 'sage', 'rose', 'random'],
    },
    date: { type: 'string', default: 'today', description: 'Current date (ISO format: 2024-01-15)' },
    birthdate: { type: 'string', default: 'null', description: 'Birth date for life view and birthday highlighting (ISO format)' },
  },
  usage: {
    'iOS Shortcuts': 'Use "Get Contents of URL" action with your API URL, then "Set Wallpaper Photo" to Lock Screen',
    'Direct Link': 'Access any endpoint URL directly in a browser to download the image',
  },
}

export async function GET() {
  return NextResponse.json(DOCS, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

