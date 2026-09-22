import type { Section } from "../../types";

export interface SeatSectionProps {
    sections: Section[];
    selectedIds: Set<string>;
    unavailableIds: Set<string>;
    onToggle: (seatId: string) => void;
}