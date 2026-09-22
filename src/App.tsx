
import { useCallback } from 'react'
import './App.css'
import { useSeatmap } from './hooks/useSeatmap'
import { useSeatSelection } from './hooks/useSeatSelection'
import { useSeatSimulation } from './hooks/useSeatSimulation'
import SeatSection from './components/Section'
import SidebarPanel from './components/SidebarPanel'

function App() {
  const { seatmap, allSeats, unavailableSeatIds, markUnavailable, isLoading, error } = useSeatmap()
  const { selectedIds, toggleSeat } = useSeatSelection(unavailableSeatIds)

  const takeSeat = useCallback((id: string) => markUnavailable([id]), [markUnavailable])
  useSeatSimulation(allSeats, unavailableSeatIds, selectedIds, takeSeat)

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
          <SeatSection
            sections={seatmap.sections}
            selectedIds={selectedIds}
            unavailableIds={unavailableSeatIds}
            onToggle={toggleSeat}
          />
        </main>

        <SidebarPanel
          selectedSeats={allSeats.filter(seat => selectedIds.has(seat.id))}
          unavailableIds={unavailableSeatIds}
          onRemove={toggleSeat}
        />
      </div>
    </div>
  )
}

export default App
