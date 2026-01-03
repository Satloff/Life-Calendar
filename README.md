# Life Calendar

Dynamic wallpaper generator for tracking your year and life progress. Designed for iPhone lock screens with iOS Shortcuts automation.

![Life Calendar Preview](https://via.placeholder.com/800x400?text=Life+Calendar+Preview)

## Inspiration

This project is inspired by Tim Urban's 2014 essay **["Your Life in Weeks"](https://waitbutwhy.com/2014/05/life-weeks.html)** on Wait But Why.

> *"Sometimes life seems really short, and other times it seems impossibly long. But this chart helps to emphasize that it's most certainly finite. Those are your weeks and they're all you've got."*
> — Tim Urban

The essay visualizes a 90-year human life as a grid of weeks — just 4,680 boxes. This project brings that concept to your phone as a daily wallpaper, reminding you to make the most of your precious weeks.

## Features

- **4 Layout Styles**
  - **Days** — All 365 days of the year in a grid
  - **Months** — 12 month grids with day-of-week alignment
  - **Quarters** — 4 quarter grids with day-of-week alignment
  - **Life** — Weeks lived out of 90 years (4,680 weeks)

- **5 Color Themes**
  - `amber` — Dark background with orange accents
  - `midnight` — Dark background with white text
  - `retro` — Light cream with blue accents
  - `terminal` — Warm cream with dark text
  - `paper` — Light paper-like with dark text

- **iPhone Optimized**
  - Safe zones for clock and home indicator
  - Preset dimensions for all iPhone models
  - Crisp rendering at native resolution

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to configure your wallpaper.

## API Endpoints

All endpoints return PNG images.

### `/api/days`
Year progress as a grid of 365 days.

### `/api/months`
Year progress as 12 monthly grids (4×3 layout).

### `/api/quarters`
Year progress as 4 quarterly grids (2×2 layout).

### `/api/life`
Life progress as weeks until age 90.

### Query Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `width` | `1179` | Image width in pixels |
| `height` | `2556` | Image height in pixels |
| `theme` | `amber` | Color theme (`amber`, `midnight`, `retro`, `terminal`, `paper`) |
| `date` | Today | Current date (ISO format: `2024-01-15`) |
| `birthdate` | `1990-01-01` | Birth date for life view (ISO format) |

### Example URLs

```
/api/days?width=1179&height=2556&theme=amber
/api/life?width=1179&height=2556&theme=midnight&birthdate=1990-05-15
/api/quarters?theme=retro
```

## iOS Shortcuts Setup

1. **Open Shortcuts app** → Automation tab
2. **Create New Automation** → Time of Day → 6:00 AM → Daily → Run Immediately
3. **Add Actions:**
   - "Get Contents of URL" → Paste your API URL
   - "Set Wallpaper Photo" → Lock Screen
4. **Important:** Disable "Crop to Subject" and "Show Preview"

## Project Structure

```
life-calendar/
├── app/
│   ├── api/
│   │   ├── days/route.tsx      # Days endpoint
│   │   ├── life/route.tsx      # Life endpoint
│   │   ├── months/route.tsx    # Months endpoint
│   │   └── quarters/route.tsx  # Quarters endpoint
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Configuration UI
├── lib/
│   ├── constants.ts            # Layout & defaults
│   ├── font.ts                 # Font loader
│   └── utils.ts                # Themes & helpers
├── public/
│   └── fonts/
│       └── DepartureMono-Regular.otf
└── package.json
```

## Tech Stack

- **Next.js 15** with App Router
- **Turbopack** for fast development
- **@vercel/og** for image generation
- **DepartureMono** font for retro aesthetic
- **Edge Runtime** for fast global response

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/life-calendar)

Or deploy manually:

```bash
npm run build
npm start
```

## License

MIT License — feel free to use and modify.

## Credits

- Concept: [Tim Urban](https://waitbutwhy.com) — ["Your Life in Weeks"](https://waitbutwhy.com/2014/05/life-weeks.html) (2014)
- iPhone Wallpaper Idea: [Luis Batalha](https://www.linkedin.com/in/luis-batalha-90811838a/)
- Font: [Departure Mono](https://departuremono.com) by Helena Zhang

