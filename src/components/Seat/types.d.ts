export interface SeatProps {
    id: string;
    number: number;
    selected: boolean;
    unavailable: boolean;
    onToggle: (seatId: string) => void;
}
