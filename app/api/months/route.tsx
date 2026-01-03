import { ImageResponse } from '@vercel/og'
import { themes, getParams, daysInYear } from '@/lib/utils'

export const runtime = 'edge'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export async function GET(req: Request) {
  const { width, height, theme, date } = getParams(req.url)
  const t = themes[theme] || themes.midnight
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

  const cols = 7
  // Available height after top (28%) and bottom (14.8%) padding
  const availableHeight = height * 0.572
  // Months grid: 4 rows of months, each ~5 rows of dots = ~20 rows, plus gaps
  const rowsPerMonth = 5
  const monthRows = 4
  const totalGridRows = rowsPerMonth * monthRows
  // Reserve minimal space for footer and gaps between month rows
  const footerHeight = height * 0.035
  const monthRowGap = height * 0.02
  const availableForDots = availableHeight - footerHeight - (monthRowGap * (monthRows - 1))
  // Calculate dot size to fill available space
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Build month grids
  const months = Array.from({ length: 12 }, (_, m) => {
    const days = daysInMonth(m, year)
    const dots = []
    for (let d = 1; d <= days; d++) {
      let color = t.future
      if (m < currentMonth || (m === currentMonth && d < currentDay)) {
        color = t.done
      }
      if (m === currentMonth && d === currentDay) {
        color = t.now
      }
      dots.push(
        <div
          key={d}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      )
    }
    return { label: monthNames[m], dots }
  })

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
        {/* 4x3 grid of months */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(monthRowGap) }}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} style={{ display: 'flex', gap: Math.floor(width * 0.06) }}>
              {[0, 1, 2].map((col) => {
                const m = months[row * 3 + col]
                return (
                  <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', color: t.done, fontSize: Math.floor(dotSize * 1.3), opacity: 0.6 }}>{m.label}</div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: gap,
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

