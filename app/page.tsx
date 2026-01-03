export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1>Life Calendar</h1>
      <p>Generate wallpapers:</p>
      <ul>
        <li><code>/api/quarters</code> - Year by quarters</li>
        <li><code>/api/life</code> - 90-year life grid</li>
        <li><code>/api/months</code> - Year by months</li>
        <li><code>/api/days</code> - Year as 365 days</li>
      </ul>
      <p>Params: <code>?width=1179&height=2556&theme=midnight&date=2026-01-03</code></p>
    </main>
  )
}

