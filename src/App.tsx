
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

  const [order, setOrder] = useState<SeatWithContext[] | null>(null)

  const takeSeat = useCallback((id: string) => markUnavailable([id]), [markUnavailable])
  useSeatSimulation(allSeats, unavailableSeatIds, selectedIds, takeSeat, order === null)

  const selectedSeats = allSeats.filter(seat => selectedIds.has(seat.id))

  const handleToggle = useCallback((id: string) => {
    if (order === null) toggleSeat(id)
  }, [order, toggleSeat])

  
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
