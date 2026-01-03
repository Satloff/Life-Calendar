import { ImageResponse } from '@vercel/og'
import { themes, getParams, dayOfYear, daysInQuarter, quarterStartDay, daysInYear } from '@/lib/utils'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { width, height, theme, date } = getParams(req.url)
  const t = themes[theme] || themes.midnight
  const year = date.getFullYear()
  const today = dayOfYear(date)
  const totalDays = daysInYear(year)
  const daysLeft = totalDays - today
  const pct = Math.round((today / totalDays) * 100)

  const cols = 7
  // Available height after top (28%) and bottom (14.8%) padding
  const availableHeight = height * 0.572
  // 2 rows of quarters, each ~14 rows tall (max 91 days + offset / 7 cols)
  const rowsPerQuarter = 14
  const totalGridRows = rowsPerQuarter * 2
  // Reserve minimal space for footer and gap between quarter rows
  const footerHeight = height * 0.035
  const quarterRowGap = height * 0.02
  const availableForDots = availableHeight - footerHeight - quarterRowGap
  // Calculate dot size to fill available space (dot + gap per row)
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Quarter start months: Q1=Jan, Q2=Apr, Q3=Jul, Q4=Oct
  const quarterStartMonths = [0, 3, 6, 9]

  // Build quarter grids
  const quarters = [0, 1, 2, 3].map((q) => {
    const days = daysInQuarter(q, year)
    const startDay = quarterStartDay(q, year)
    
    // Get the day of week for the first day of this quarter (0=Sunday, 6=Saturday)
    const firstDayOfQuarter = new Date(year, quarterStartMonths[q], 1)
    const startDayOfWeek = firstDayOfQuarter.getDay()
    
    const dots = []
    
    // Add empty placeholder dots to align with day of week
    for (let i = 0; i < startDayOfWeek; i++) {
      dots.push(
        <div
          key={`empty-${i}`}
          style={{
            width: dotSize,
            height: dotSize,
          }}
        />
      )
    }
    
    // Add actual day dots
    for (let i = 0; i < days; i++) {
      const dayNum = startDay + i
      let color = t.future
      if (dayNum < today) color = t.done
      if (dayNum === today) color = t.now
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
    return { label: `Q${q + 1}`, dots }
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
        {/* 2x2 grid of quarters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(quarterRowGap) }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: 'flex', gap: Math.floor(width * 0.08) }}>
              {[0, 1].map((col) => {
                const q = quarters[row * 2 + col]
                return (
                  <div key={col} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
                    {/* Quarter label */}
                    <div style={{ display: 'flex', color: t.done, fontSize: Math.floor(dotSize * 1.3), opacity: 0.6, height: dotSize, alignItems: 'center' }}>{q.label}</div>
                    {/* Dot grid */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: gap,
                        width: cols * (dotSize + gap) - gap,
                      }}
                    >
                      {q.dots}
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

