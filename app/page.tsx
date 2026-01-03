'use client'

import { useState, useEffect } from 'react'
import { themes, type ThemeName } from '@/lib/utils'
import { DEFAULTS } from '@/lib/constants'

// ============================================
// CONFIGURATION
// ============================================

interface IPhoneModel {
  name: string
  width: number
  height: number
}

const IPHONE_MODELS: IPhoneModel[] = [
  { name: 'iPhone 17 Pro Max', width: 1320, height: 2868 },
  { name: 'iPhone 17 Pro', width: 1206, height: 2622 },
  { name: 'iPhone 17', width: 1206, height: 2622 },
  { name: 'iPhone 16 Pro Max', width: 1320, height: 2868 },
  { name: 'iPhone 16 Pro', width: 1206, height: 2622 },
  { name: 'iPhone 15 Plus / 15 Pro Max / 16 Plus', width: 1290, height: 2796 },
  { name: 'iPhone 15 / 15 Pro / 16', width: DEFAULTS.WIDTH, height: DEFAULTS.HEIGHT },
  { name: 'iPhone 13 Pro Max / 14 Plus / 14 Pro Max', width: 1284, height: 2778 },
  { name: 'iPhone 13 / 13 Pro / 14 / 14 Pro', width: 1170, height: 2532 },
  { name: 'iPhone 13 mini', width: 1080, height: 2340 },
]

type LayoutPath = 'days' | 'months' | 'quarters' | 'life'

const LAYOUTS: readonly { name: string; path: LayoutPath }[] = [
  { name: 'Days (all days of the year)', path: 'days' },
  { name: 'Months (12 month grids)', path: 'months' },
  { name: 'Quarters (4 quarter grids)', path: 'quarters' },
  { name: 'Life (weeks until 90)', path: 'life' },
]

const THEME_NAMES = Object.keys(themes) as ThemeName[]
const THEME_OPTIONS = [...THEME_NAMES, 'random'] as const
type ThemeOption = ThemeName | 'random'

/** Extended site themes with UI-specific colors */
const SITE_THEMES: Record<ThemeName, {
  bg: string
  text: string
  accent: string
  muted: string
  inputBg: string
  border: string
  special: string
}> = {
  amber: { bg: '#1a1612', text: '#e89028', accent: '#ff5500', muted: '#5a4020', inputBg: '#251c14', border: '#3d2a18', special: '#e84393' },
  midnight: { bg: '#1a1a1a', text: '#ffffff', accent: '#ff6b47', muted: '#3d3d3d', inputBg: '#222222', border: '#444444', special: '#00d9ff' },
  retro: { bg: '#f0ede6', text: '#3d5a9f', accent: '#e63946', muted: '#b8c4e0', inputBg: '#e8e4dc', border: '#c8c4bc', special: '#9b59b6' },
  terminal: { bg: '#d4cfc4', text: '#2a2a2a', accent: '#c41e3a', muted: '#a8a090', inputBg: '#c8c3b8', border: '#9a9588', special: '#8e44ad' },
  paper: { bg: '#f5f2eb', text: '#2d2d2d', accent: '#e63946', muted: '#d4d0c8', inputBg: '#ebe8e0', border: '#c8c4bc', special: '#9b59b6' },
  duck: { bg: '#d4a039', text: '#0a2a4e', accent: '#082848', muted: '#9a7020', inputBg: '#c89530', border: '#8a6018', special: '#0a2a4e' },
  blueprint: { bg: '#e8e0d0', text: '#1a3070', accent: '#0a2060', muted: '#b8b0a0', inputBg: '#e0d8c8', border: '#a8a090', special: '#701a3a' },
  sage: { bg: '#a8b8a8', text: '#5a2a1a', accent: '#4a2010', muted: '#788878', inputBg: '#9cac9c', border: '#687868', special: '#1a4a6a' },
  rose: { bg: '#1a1216', text: '#e890a8', accent: '#ff4080', muted: '#4a2035', inputBg: '#251820', border: '#3d1828', special: '#00d9ff' },
}

// ============================================
// COMPONENT
// ============================================

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeOption>(DEFAULTS.THEME as ThemeOption)
  const [layout, setLayout] = useState<LayoutPath>('days')
  const [model, setModel] = useState(IPHONE_MODELS[2])
  const [birthdate, setBirthdate] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [timestamp, setTimestamp] = useState('')
  const [heartJiggle, setHeartJiggle] = useState(false)
  const [heartClicks, setHeartClicks] = useState(0)

  // Set timestamp on client only to avoid hydration mismatch
  useEffect(() => {
    setTimestamp(`&_t=${Date.now()}`)
  }, [theme, layout, model, birthdate])

  // For 'random' theme, use amber styling for the UI
  const t = theme === 'random' ? SITE_THEMES.amber : SITE_THEMES[theme]
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const apiUrl = `${baseUrl}/api/${layout}?width=${model.width}&height=${model.height}&theme=${theme}${birthdate ? `&birthdate=${birthdate}` : ''}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiUrl)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const isDarkTheme = theme === 'amber' || theme === 'midnight' || theme === 'rose' || theme === 'random'

  return (
    <main className="main">
      <style>{`
        * { box-sizing: border-box; }
        
        .main {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: ${t.bg};
          min-height: 100vh;
          color: ${t.text};
          transition: background-color 0.3s, color 0.3s;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .header { margin-bottom: 48px; text-align: center; }
        .header h1 { font-size: 28px; margin: 0 0 8px 0; }
        .header p { color: ${t.muted}; font-size: 14px; margin: 0; }
        
        .content { display: grid; grid-template-columns: 1fr; gap: 48px; }
        
        @media (min-width: 900px) {
          .content { grid-template-columns: 1fr 1fr; gap: 60px; }
          .header h1 { font-size: 32px; }
        }
        
        .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .step-number {
          width: 32px; height: 32px;
          background-color: ${t.text}; color: ${t.bg};
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px; flex-shrink: 0;
        }
        .step-content { margin-left: 0; }
        @media (min-width: 600px) { .step-content { margin-left: 44px; } }
        
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 12px; color: ${t.muted}; margin-bottom: 6px; }
        .form-input, .form-select {
          width: 100%; padding: 12px;
          background-color: ${t.inputBg}; border: 1px solid ${t.border};
          color: ${t.text}; font-family: inherit; font-size: 14px;
          -webkit-appearance: none; appearance: none;
        }
        .form-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(t.text)}' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px;
        }
        
        .info-box { background-color: ${t.inputBg}; border: 1px solid ${t.border}; padding: 16px; }
        .warning-box {
          background-color: ${t.accent}20; border: 1px solid ${t.accent}50;
          padding: 12px; margin: 16px -16px -16px -16px;
        }
        
        .url-group { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        @media (min-width: 500px) { .url-group { flex-direction: row; } }
        .url-input {
          flex: 1; padding: 8px 12px;
          background-color: ${t.bg}; border: 1px solid ${t.border};
          color: ${t.muted}; font-family: inherit; font-size: 11px; min-width: 0;
        }
        .copy-btn {
          padding: 8px 16px; background-color: transparent;
          border: 1px solid ${t.border}; color: ${t.text};
          cursor: pointer; font-family: inherit; font-size: 13px;
          transition: background-color 0.2s, color 0.2s;
        }
        .copy-btn:hover { background-color: ${t.text}; color: ${t.bg}; }
        
        .preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 900px) { .preview-grid { gap: 20px; } }
        .preview-item { text-align: center; }
        .preview-label { font-size: 11px; color: ${t.muted}; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .preview-img { width: 100%; max-width: 180px; aspect-ratio: 9 / 19.5; object-fit: cover; cursor: pointer; }
        .preview-img.selected { border: 2px solid ${t.text}; }
        .preview-img.unselected { border: 1px solid ${t.border}; }
        
        .toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          background-color: ${t.text}; color: ${t.bg};
          padding: 12px 24px; font-size: 14px; font-weight: 500;
          animation: fadeIn 0.2s ease-out; z-index: 1000;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        .footer {
          text-align: center;
          padding: 40px 20px;
          margin-top: 60px;
          font-size: 14px;
          color: ${t.muted};
          border-top: 1px solid ${t.border};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .footer .heart-icon {
          width: 16px;
          height: 16px;
          color: ${t.accent};
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .footer .heart-icon:hover {
          transform: scale(1.2);
        }
        .footer .heart-icon.jiggle {
          animation: jiggle 0.5s ease;
        }
        @keyframes jiggle {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-8deg); }
          50% { transform: scale(1.15) rotate(8deg); }
          75% { transform: scale(1.1) rotate(-4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .footer .heart-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .footer .heart-tooltip {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          background-color: ${t.text};
          color: ${t.bg};
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          animation: tooltipPop 0.2s ease-out;
        }
        .footer .heart-tooltip::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid ${t.text};
        }
        @keyframes tooltipPop {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .footer .footer-link {
          color: ${t.text};
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .footer .footer-link:hover { opacity: 1; }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${isDarkTheme ? 'invert(1)' : 'none'}; opacity: 0.6; cursor: pointer;
        }
        select option { background-color: ${t.inputBg}; color: ${t.text}; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>[ LIFE CALENDAR ]</h1>
          <p>Dynamic wallpapers to track your year and life progress</p>
        </div>

        <div className="content">
          {/* Instructions */}
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Installation Steps</h2>
            <p style={{ color: t.muted, fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
              Define your wallpaper settings. Create an iOS automation to run daily. Add the shortcut actions to update your lock screen.
            </p>

            {/* Step 1: Configure */}
            <div style={{ marginBottom: 32 }}>
              <div className="step-header">
                <div className="step-number">1</div>
                <h3 style={{ fontSize: 18, margin: 0 }}>Define your Wallpaper</h3>
              </div>
              <div className="step-content">
                <div className="form-group">
                  <label className="form-label">Layout Style</label>
                  <select value={layout} onChange={(e) => setLayout(e.target.value as LayoutPath)} className="form-select">
                    {LAYOUTS.map(l => <option key={l.path} value={l.path}>{l.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">iPhone Model</label>
                  <select 
                    value={model.name} 
                    onChange={(e) => setModel(IPHONE_MODELS.find(m => m.name === e.target.value) || IPHONE_MODELS[2])}
                    className="form-select"
                  >
                    {IPHONE_MODELS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeOption)} className="form-select">
                    {THEME_OPTIONS.map(tn => <option key={tn} value={tn}>{tn}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Birthdate (optional - highlights your birthday)</label>
                  <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="form-input" />
                </div>
              </div>
            </div>

            {/* Step 2: Automation */}
            <div style={{ marginBottom: 32 }}>
              <div className="step-header">
                <div className="step-number">2</div>
                <h3 style={{ fontSize: 18, margin: 0 }}>Create Automation</h3>
              </div>
              <div className="step-content">
                <div className="info-box">
                  <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.8, margin: 0 }}>
                    Open <span style={{ color: t.text }}>Shortcuts</span> app → <span style={{ color: t.text }}>Automation</span> tab → New Automation → <span style={{ color: t.text }}>Time of Day</span> → <span style={{ color: t.text }}>6:00 AM</span> → Repeat <span style={{ color: t.text }}>"Daily"</span> → <span style={{ color: t.text }}>"Run Immediately"</span> → <span style={{ color: t.text }}>"Create New Shortcut"</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Shortcut */}
            <div style={{ marginBottom: 32 }}>
              <div className="step-header">
                <div className="step-number">3</div>
                <h3 style={{ fontSize: 18, margin: 0 }}>Create Shortcut</h3>
              </div>
              <div className="step-content">
                <div className="info-box">
                  <p style={{ fontSize: 11, color: t.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 0 }}>Add these actions:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: t.muted, fontSize: 13 }}>3.1</span>
                      <div style={{ fontSize: 13, flex: 1, minWidth: 0 }}>
                        <span style={{ color: t.text }}>"Get Contents of URL"</span>
                        <span style={{ color: t.muted }}> → paste:</span>
                        <div className="url-group">
                          <input readOnly value={apiUrl} className="url-input" onClick={(e) => (e.target as HTMLInputElement).select()} />
                          <button onClick={handleCopy} className="copy-btn">Copy</button>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: t.muted, fontSize: 13 }}>3.2</span>
                      <p style={{ fontSize: 13, margin: 0 }}>
                        <span style={{ color: t.text }}>"Set Wallpaper Photo"</span>
                        <span style={{ color: t.muted }}> → choose "Lock Screen"</span>
                      </p>
                    </div>
                  </div>
                  <div className="warning-box">
                    <p style={{ fontSize: 13, color: t.accent, margin: 0 }}>
                      <strong>Important:</strong> Disable both <strong>"Crop to Subject"</strong> and <strong>"Show Preview"</strong>
                    </p>
                    <p style={{ fontSize: 11, color: t.accent, opacity: 0.7, marginTop: 4, marginBottom: 0 }}>This prevents iOS from cropping and asking for confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 24 }}>Preview</h2>
            <div className="preview-grid">
              {LAYOUTS.map(({ name, path }) => (
                <div key={path} className="preview-item">
                  <p className="preview-label">{name.split(' ')[0]}</p>
                  <img 
                    src={`/api/${path}?width=${model.width}&height=${model.height}&theme=${theme}${birthdate ? `&birthdate=${birthdate}` : ''}${timestamp}`}
                    alt={name}
                    className={`preview-img ${path === layout ? 'selected' : 'unselected'}`}
                    onClick={() => setLayout(path)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showToast && <div className="toast">URL copied to clipboard</div>}

      {/* Footer */}
      <footer className="footer">
        Made with{' '}
        <span className="heart-wrapper">
          {heartClicks > 0 && <span className="heart-tooltip">{heartClicks}</span>}
          <svg 
            className={`heart-icon ${heartJiggle ? 'jiggle' : ''}`}
            viewBox="0 0 24 24" 
            fill="currentColor"
            onClick={() => {
              setHeartJiggle(true)
              setHeartClicks(c => c + 1)
              setTimeout(() => setHeartJiggle(false), 500)
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        {' '}by{' '}
        <a href="https://www.linkedin.com/in/theo-satloff/" target="_blank" rel="noopener noreferrer" className="footer-link">
          theo-satloff
        </a>
      </footer>
    </main>
  )
}
