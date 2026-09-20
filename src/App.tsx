
import './App.css'
import { useSeatmap } from './hooks/useSeatmap'
import SeatSection from './components/Section'

function App() {
  const { seatmap, allSeats, isLoading, error } = useSeatmap()

  if (isLoading)
    return <p className="app-status">Loading seatmap ...</p>

  if (error)
    return <p className="app-status" data-tone="error">{error}</p>

  if (!seatmap)
    return null;

  return (
    <div className="app">
      <header>
        <h1>{seatmap.eventName}</h1>
        <p>{seatmap.venue} · {allSeats.length} seats</p>
      </header>

      <div className="app-body">
        <main className="seatmap">
          <SeatSection sections={seatmap.sections} />
        </main>

        <aside>
          <h2>Selection</h2>
          <p className="aside-empty">No seats selected yet.</p>
        </aside>
      </div>
    </div>
  )
}

export default App
