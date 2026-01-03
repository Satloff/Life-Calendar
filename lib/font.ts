import { FONT } from './constants'

/**
 * Load the DepartureMono font for use in ImageResponse
 * Must be called from an edge runtime route
 */
export async function loadFont(requestUrl: string): Promise<ArrayBuffer> {
  const fontUrl = new URL(FONT.PATH, requestUrl)
  const response = await fetch(fontUrl)
  
  if (!response.ok) {
    throw new Error(`Failed to load font: ${response.statusText}`)
  }
  
  return response.arrayBuffer()
}

/**
 * Font configuration for ImageResponse
 */
export function getFontConfig(fontData: ArrayBuffer) {
  return [
    {
      name: FONT.NAME,
      data: fontData,
      style: 'normal' as const,
    },
  ]
}

