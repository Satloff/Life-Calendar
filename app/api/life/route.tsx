import { ImageResponse } from '@vercel/og'
import { themes, getParams, weeksAlive } from '@/lib/utils'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { width, height, theme, date, birthdate } = getParams(req.url)
  const t = themes[theme] || themes.midnight

  const lifespan = 90
  const weeksPerYear = 52
  const totalWeeks = lifespan * weeksPerYear
  const weeksLived = weeksAlive(birthdate, date)
  const weeksLeft = Math.max(0, totalWeeks - weeksLived)
  const pct = ((weeksLived / totalWeeks) * 100).toFixed(1)

  const cols = weeksPerYear
  // Available height after top (28%) and bottom (14.8%) padding
  const availableHeight = height * 0.572
  // Life grid: 90 years = 90 rows
  const totalGridRows = lifespan
  // Reserve minimal space for footer only (no title)
  const footerHeight = height * 0.035
  const availableForDots = availableHeight - footerHeight
  // Calculate dot size to fill available space
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  const dots = []
  for (let i = 0; i < totalWeeks; i++) {
    let color = t.future
    if (i < weeksLived) color = t.done
    if (i === weeksLived) color = t.now
    dots.push(
      <div
        key={i}
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: t.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: Math.floor(height * 0.28),
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: Math.max(250, Math.floor(height * 0.148)),
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: gap,
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
            fontSize: Math.floor(height * 0.0144),
            gap: 16,
          }}
        >
          <span style={{ color: t.done, opacity: 0.6 }}>{pct}% to {lifespan}</span>
        </div>
      </div>
    ),
    { width, height }
  )
}

