
import './App.css'
import { useSeatmap } from './hooks/useSeatmap'
import SeatSection from './components/Section'

function App() {
  const { seatmap, allSeats, isLoading, error } = useSeatmap()

  if (isLoading)
    return <p>Loading seatmap ...</p>

  if (error)
    return <p>{error }</p>

  if (!seatmap)
    return null;

  return (
    <>
    <div>
      hello there
      <p>{seatmap.venue} - {allSeats.length}</p>
    </div>
    <SeatSection sections={seatmap.sections} />
    </>
  )
}

export default App
