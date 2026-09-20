import { useEffect, useState, useMemo, useCallback } from "react"
import type { Seatmap } from "../types";
import { collectUnavailable, flattenSeatMap, indexSeats } from "../helpers/seatmapHelpers"

export function useSeatmap() {
    // usestates
    const [seatmap, setSeatmap] = useState<Seatmap | null>(null);
    const [unavailableSeatIds, setUnavailableSeatIds] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const allSeats = useMemo(() => (
        seatmap ? flattenSeatMap(seatmap) : []
    ), [seatmap])

    const seatById = useMemo(() => 
        indexSeats(allSeats)
    , [allSeats])

    const markUnavailable = useCallback((ids: string[]) => {
        setUnavailableSeatIds((prev) => 
            new Set([...prev, ...ids])
        )
    }, [])

    // this will only run once on mount
    useEffect(() => {
        fetch("/seatmap.json")
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load setmap: ${res.status}`);
                return res.json();
            })
            .then((data: Seatmap) => {
                setSeatmap(data);
                setUnavailableSeatIds(collectUnavailable(flattenSeatMap(data)))
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, [])

    return {
        seatmap,
        allSeats,
        seatById,
        unavailableSeatIds,
        isLoading,
        error,
        markUnavailable,
    }
}