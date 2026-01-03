import { ImageResponse } from '@vercel/og'
import { themes, getParams, dayOfYear, daysInYear } from '@/lib/utils'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { width, height, theme, date } = getParams(req.url)
  const t = themes[theme] || themes.midnight
  const year = date.getFullYear()
  const today = dayOfYear(date)
  const totalDays = daysInYear(year)
  const daysLeft = totalDays - today
  const pct = Math.round((today / totalDays) * 100)

  const cols = 15
  // Available height after top (28%) and bottom (14.8%) padding
  const availableHeight = height * 0.572
  // Days grid: 365 days / 15 cols = ~25 rows
  const totalGridRows = Math.ceil(totalDays / cols)
  // Reserve minimal space for title and footer
  const titleHeight = height * 0.04
  const footerHeight = height * 0.035
  const availableForDots = availableHeight - titleHeight - footerHeight
  // Calculate dot size to fill available space
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  const dots = []
  for (let i = 1; i <= totalDays; i++) {
    let color = t.future
    if (i < today) color = t.done
    if (i === today) color = t.now
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
          paddingBottom: Math.floor(height * 0.148),
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', color: t.done, fontSize: Math.floor(dotSize * 1.3), marginBottom: Math.round(titleHeight * 0.3), opacity: 0.6 }}>
          {year}
        </div>
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
          <span style={{ color: t.now }}>{daysLeft}d left</span>
          <span style={{ color: t.future }}>·</span>
          <span style={{ color: t.done, opacity: 0.6 }}>{pct}%</span>
        </div>
      </div>
    ),
    { width, height }
  )
}

