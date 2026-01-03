import { ImageResponse } from '@vercel/og'
import { themes, getParams, weeksAlive } from '@/lib/utils'
import { loadFont, getFontConfig } from '@/lib/font'
import { LAYOUT, FONT, DEFAULTS } from '@/lib/constants'

export const runtime = 'edge'

export async function GET(req: Request) {
  const fontData = await loadFont(req.url)
  const { width, height, theme, date, birthdate } = getParams(req.url)
  const t = themes[theme] || themes.amber

  // Life calculations
  const lifespan = DEFAULTS.LIFESPAN
  const weeksPerYear = 52
  const totalWeeks = lifespan * weeksPerYear
  const weeksLived = weeksAlive(birthdate, date)
  const pct = ((weeksLived / totalWeeks) * 100).toFixed(1)

  // Grid configuration
  const cols = weeksPerYear
  const totalGridRows = lifespan

  // Layout calculations
  const availableHeight = height * LAYOUT.CONTENT_HEIGHT
  const footerHeight = height * LAYOUT.FOOTER_HEIGHT
  const availableForDots = availableHeight - footerHeight

  // Dot sizing
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Build dot grid
  const dots = Array.from({ length: totalWeeks }, (_, i) => {
    let color = t.future
    if (i < weeksLived) color = t.done
    if (i === weeksLived) color = t.now
    return (
      <div
        key={i}
        style={{ width: dotSize, height: dotSize, backgroundColor: color }}
      />
    )
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: t.bg,
          fontFamily: FONT.NAME,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: Math.floor(height * LAYOUT.TOP_PADDING),
          paddingBottom: Math.max(250, Math.floor(height * LAYOUT.BOTTOM_PADDING)),
          paddingLeft: LAYOUT.SIDE_PADDING,
          paddingRight: LAYOUT.SIDE_PADDING,
        }}
      >
        {/* Title */}
        <div
          style={{
            display: 'flex',
            color: t.done,
            fontSize: Math.floor(height * LAYOUT.TITLE_FONT_SIZE),
            letterSpacing: 1,
            marginBottom: Math.round(footerHeight * 1.2),
          }}
        >
          [ LIFE PROGRESS ]
        </div>

        {/* Dot grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap,
            width: cols * (dotSize + gap) - gap,
          }}
        >
          {dots}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            marginTop: Math.round(footerHeight * 0.4),
            fontSize: Math.floor(height * LAYOUT.FOOTER_FONT_SIZE),
            gap: 16,
          }}
        >
          <span style={{ color: t.done, opacity: 0.6 }}>{pct}% to {lifespan}</span>
        </div>
      </div>
    ),
    { width, height, fonts: getFontConfig(fontData) }
  )
}
