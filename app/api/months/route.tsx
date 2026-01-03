import { ImageResponse } from '@vercel/og'
import { themes, getParams, daysInYear, daysInMonth, isBirthday } from '@/lib/utils'
import { loadFont, getFontConfig } from '@/lib/font'
import { LAYOUT, FONT } from '@/lib/constants'

export const runtime = 'edge'

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export async function GET(req: Request) {
  const fontData = await loadFont(req.url)
  const { width, height, theme, date, birthdate } = getParams(req.url)
  const t = themes[theme] || themes.amber

  const year = date.getFullYear()
  const currentMonth = date.getMonth()
  const currentDay = date.getDate()
  const totalDays = daysInYear(year)

  // Count days passed
  let daysPassed = 0
  for (let m = 0; m < currentMonth; m++) {
    daysPassed += daysInMonth(m, year)
  }
  daysPassed += currentDay

  const daysLeft = totalDays - daysPassed
  const pct = Math.round((daysPassed / totalDays) * 100)

  // Grid configuration
  const cols = 7
  const monthRows = 4
  const dotRowsPerMonth = 5

  // Layout calculations
  const availableHeight = height * LAYOUT.CONTENT_HEIGHT
  const footerHeight = height * LAYOUT.FOOTER_HEIGHT
  const monthRowGap = height * 0.025
  const labelHeight = height * 0.02
  const labelGap = height * 0.008
  const totalLabelSpace = (labelHeight + labelGap) * monthRows
  const totalGapSpace = monthRowGap * (monthRows - 1)
  const availableForDots = availableHeight - footerHeight - totalGapSpace - totalLabelSpace

  // Dot sizing
  const totalDotRows = dotRowsPerMonth * monthRows
  const gapRatio = 0.7
  const dotPlusGap = availableForDots / totalDotRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Build month grids
  const months = Array.from({ length: 12 }, (_, m) => {
    const days = daysInMonth(m, year)
    const firstDayOfMonth = new Date(year, m, 1)
    const startDayOfWeek = firstDayOfMonth.getDay()

    const dots = []

    // Empty placeholders for day-of-week alignment
    for (let i = 0; i < startDayOfWeek; i++) {
      dots.push(
        <div key={`empty-${i}`} style={{ width: dotSize, height: dotSize }} />
      )
    }

    // Day dots
    for (let d = 1; d <= days; d++) {
      const isBirthdayDay = isBirthday(m, d, birthdate)
      
      let color: string = t.future
      if (m < currentMonth || (m === currentMonth && d < currentDay)) {
        color = t.done
      }
      if (m === currentMonth && d === currentDay) {
        color = t.now
      }
      if (isBirthdayDay) {
        color = t.special
      }
      
      dots.push(
        <div key={d} style={{ width: dotSize, height: dotSize, backgroundColor: color }} />
      )
    }

    return { label: MONTH_NAMES[m], dots }
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
          paddingBottom: Math.floor(height * LAYOUT.BOTTOM_PADDING),
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
          [ MONTHLY PROGRESS ]
        </div>

        {/* 4x3 grid of months */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(monthRowGap) }}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} style={{ display: 'flex', gap: Math.floor(width * 0.06) }}>
              {[0, 1, 2].map((col) => {
                const m = months[row * 3 + col]
                return (
                  <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: Math.round(labelGap) }}>
                    <div style={{ display: 'flex', color: t.done, fontSize: Math.floor(dotSize * 1.3), opacity: 0.8 }}>
                      {m.label}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap,
                        width: cols * (dotSize + gap) - gap,
                      }}
                    >
                      {m.dots}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
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
          <span style={{ color: t.now }}>{daysLeft}d left</span>
          <span style={{ color: t.done, opacity: 0.4 }}>·</span>
          <span style={{ color: t.done, opacity: 0.6 }}>{pct}%</span>
        </div>
      </div>
    ),
    { width, height, fonts: getFontConfig(fontData) }
  )
}
