import { ImageResponse } from '@vercel/og'
import { themes, getParams, dayOfYear, daysInQuarter, quarterStartDay, daysInYear, birthdayDayOfYear, isTodayBirthday, getHolidayEasterEgg, getQuirkyHoliday } from '@/lib/utils'
import { loadFont, getFontConfig } from '@/lib/font'
import { LAYOUT, FONT } from '@/lib/constants'

export const runtime = 'edge'

const QUARTER_START_MONTHS = [0, 3, 6, 9]

export async function GET(req: Request) {
  const fontData = await loadFont(req.url)
  const { width, height, theme, date, birthdate, bg } = getParams(req.url)
  const t = themes[theme] || themes.amber

  const year = date.getFullYear()
  const today = dayOfYear(date)
  const totalDays = daysInYear(year)
  const daysLeft = totalDays - today
  const pct = Math.round((today / totalDays) * 100)
  const birthdayDay = birthdayDayOfYear(birthdate, year)
  const showBirthdayBanner = isTodayBirthday(date, birthdate)
  const holidayEasterEgg = getHolidayEasterEgg(date)
  const quirkyHoliday = getQuirkyHoliday(date)

  // Grid configuration
  const cols = 7
  const rowsPerQuarter = 14
  const totalGridRows = rowsPerQuarter * 2

  // Layout calculations
  const availableHeight = height * LAYOUT.CONTENT_HEIGHT
  const footerHeight = height * LAYOUT.FOOTER_HEIGHT
  const quarterRowGap = height * 0.02
  const availableForDots = availableHeight - footerHeight - quarterRowGap

  // Dot sizing
  const gapRatio = 0.85
  const dotPlusGap = availableForDots / totalGridRows
  const dotSize = Math.round(dotPlusGap / (1 + gapRatio))
  const gap = Math.round(dotSize * gapRatio)

  // Build quarter grids
  const quarters = [0, 1, 2, 3].map((q) => {
    const days = daysInQuarter(q, year)
    const startDay = quarterStartDay(q, year)
    const firstDayOfQuarter = new Date(year, QUARTER_START_MONTHS[q], 1)
    const startDayOfWeek = firstDayOfQuarter.getDay()

    const dots = []

    // Empty placeholders for day-of-week alignment
    for (let i = 0; i < startDayOfWeek; i++) {
      dots.push(
        <div key={`empty-${i}`} style={{ width: dotSize, height: dotSize }} />
      )
    }

    // Day dots
    for (let i = 0; i < days; i++) {
      const dayNum = startDay + i
      const isBirthdayDay = birthdayDay === dayNum
      
      let color: string = t.future
      if (dayNum < today) color = t.done
      if (dayNum === today) color = t.now
      if (isBirthdayDay) color = t.special
      
      dots.push(
        <div key={i} style={{ width: dotSize, height: dotSize, backgroundColor: color }} />
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
          fontFamily: FONT.NAME,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: Math.floor(height * LAYOUT.TOP_PADDING),
          paddingBottom: Math.floor(height * LAYOUT.BOTTOM_PADDING),
          paddingLeft: LAYOUT.SIDE_PADDING,
          paddingRight: LAYOUT.SIDE_PADDING,
          position: 'relative',
        }}
      >
        {/* Background Image */}
        {bg && (
          <img
            src={bg}
            width={width}
            height={height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: width,
              height: height,
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.15,
            }}
          />
        )}

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
          [ QUARTERLY PROGRESS ]
        </div>

        {/* 2x2 grid of quarters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(quarterRowGap) }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: 'flex', gap: Math.floor(width * 0.08) }}>
              {[0, 1].map((col) => {
                const q = quarters[row * 2 + col]
                return (
                  <div key={col} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', color: t.done, fontSize: Math.floor(dotSize * 1.3), opacity: 0.8, height: dotSize, alignItems: 'center' }}>
                      {q.label}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap,
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
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: Math.round(footerHeight * 0.4),
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: Math.floor(height * LAYOUT.FOOTER_FONT_SIZE),
              gap: 16,
            }}
          >
            <span style={{ color: t.now }}>{daysLeft}d left</span>
            <span style={{ color: t.done, opacity: 0.4 }}>·</span>
            <span style={{ color: t.done, opacity: 0.6 }}>{pct}%</span>
          </div>
          {quirkyHoliday && (
            <div
              style={{
                display: 'flex',
                fontSize: Math.floor(height * 0.01),
                color: t.done,
                opacity: 0.4,
                marginTop: 6,
              }}
            >
              Happy {quirkyHoliday}!
            </div>
          )}
        </div>

        {/* Special Day Banner - rendered last to appear on top */}
        {(showBirthdayBanner || holidayEasterEgg) && (
          <div
            style={{
              position: 'absolute',
              top: Math.floor(height * (LAYOUT.TOP_PADDING + LAYOUT.CONTENT_HEIGHT / 2)),
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: t.now,
                color: t.bg,
                fontSize: Math.floor(height * 0.022),
                fontWeight: 'bold',
                padding: `${Math.floor(height * 0.012)}px ${Math.floor(height * 0.035)}px`,
                letterSpacing: 2,
              }}
            >
              {showBirthdayBanner ? '✦ HAPPY BIRTHDAY ✦' : holidayEasterEgg?.message}
            </div>
          </div>
        )}
      </div>
    ),
    { width, height, fonts: getFontConfig(fontData) }
  )
}
