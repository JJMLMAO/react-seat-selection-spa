import type { SeatWithContext } from "../../types";

export interface SidebarPanelProps {
    selectedSeats: SeatWithContext[];
    unavailableIds: Set<string>;
    order: SeatWithContext[] | null;
    onRemove: (seatId: string) => void;
    onCheckout: () => void;
    onReset: () => void;
}
