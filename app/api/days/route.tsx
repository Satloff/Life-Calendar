import { ImageResponse } from '@vercel/og'
import { themes, getParams, dayOfYear, daysInYear, birthdayDayOfYear } from '@/lib/utils'
import { loadFont, getFontConfig } from '@/lib/font'
import { LAYOUT, FONT } from '@/lib/constants'

export const runtime = 'edge'

export async function GET(req: Request) {
  const fontData = await loadFont(req.url)
  const { width, height, theme, date, birthdate } = getParams(req.url)
  const t = themes[theme] || themes.amber

  const year = date.getFullYear()
  const today = dayOfYear(date)
  const totalDays = daysInYear(year)
  const daysLeft = totalDays - today
  const pct = Math.round((today / totalDays) * 100)
  const birthdayDay = birthdayDayOfYear(birthdate, year)

  // Grid configuration
  const cols = 15
  const totalGridRows = Math.ceil(totalDays / cols)

  // Layout calculations
  const availableHeight = height * LAYOUT.CONTENT_HEIGHT
  const footerHeight = height * LAYOUT.FOOTER_HEIGHT
  const titleSpace = (height * LAYOUT.TITLE_FONT_SIZE) + (footerHeight * 1.2)
  const footerSpace = (height * LAYOUT.FOOTER_FONT_SIZE) + (footerHeight * 0.4)
  const availableForDots = availableHeight - titleSpace - footerSpace

  // Dot sizing
  const gapRatio = 0.7
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Build dot grid
  const dots = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1
    const isBirthdayDay = birthdayDay === dayNum
    
    let color: string = t.future
    if (dayNum < today) color = t.done
    if (dayNum === today) color = t.now
    if (isBirthdayDay) color = t.special
    
    return (
      <div
        key={dayNum}
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
          [ YEARLY PROGRESS ]
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
          <span style={{ color: t.now }}>{daysLeft}d left</span>
          <span style={{ color: t.done, opacity: 0.4 }}>·</span>
          <span style={{ color: t.done, opacity: 0.6 }}>{pct}%</span>
        </div>
      </div>
    ),
    { width, height, fonts: getFontConfig(fontData) }
  )
}
