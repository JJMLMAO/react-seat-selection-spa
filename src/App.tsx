
import { useCallback, useState } from 'react'
import type { SeatWithContext } from './types'
import './App.css'
import { useSeatmap } from './hooks/useSeatmap'
import { useSeatSelection } from './hooks/useSeatSelection'
import { useSeatSimulation } from './hooks/useSeatSimulation'
import SeatSection from './components/Section'
import SidebarPanel from './components/SidebarPanel'

function App() {
  const { seatmap, allSeats, unavailableSeatIds, markUnavailable, resetAvailability, isLoading, error } = useSeatmap()
  const { selectedIds, toggleSeat, clearSelection } = useSeatSelection(unavailableSeatIds)

  /* A snapshot rather than a boolean: the receipt must keep reporting what
     was bought even if the selection is touched afterwards. */
  const [order, setOrder] = useState<SeatWithContext[] | null>(null)

  const takeSeat = useCallback((id: string) => markUnavailable([id]), [markUnavailable])
  useSeatSimulation(allSeats, unavailableSeatIds, selectedIds, takeSeat, order === null)

  const selectedSeats = allSeats.filter(seat => selectedIds.has(seat.id))

  // Locked once booked, so the map stops accepting clicks along with the sidebar.
  const handleToggle = useCallback((id: string) => {
    if (order === null) toggleSeat(id)
  }, [order, toggleSeat])

  /* Every piece of mutable state in the app, in one place — if a future
     feature adds another, it belongs here too or Reset quietly stops
     meaning "back to the start". */
  const handleReset = useCallback(() => {
    clearSelection()
    resetAvailability()
    setOrder(null)
  }, [clearSelection, resetAvailability])

  if (isLoading)
    return <p className="app-status">Loading seatmap ...</p>

  if (error)
    return <p className="app-status" data-tone="error">{error}</p>

  if (!seatmap)
    return null;

  return (
    <div className="app">
      <div className="app-body">
        <main className="seatmap">
          <p className="screen">Screen</p>
          <SeatSection
            sections={seatmap.sections}
            selectedIds={selectedIds}
            unavailableIds={unavailableSeatIds}
            onToggle={handleToggle}
          />
        </main>

        <SidebarPanel
          selectedSeats={selectedSeats}
          unavailableIds={unavailableSeatIds}
          order={order}
          onRemove={handleToggle}
          onCheckout={() => setOrder(selectedSeats)}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}

export default App
