import type { Row } from "../../types";

export interface SectionRowProps {
    rows: Row[];
    selectedIds: Set<string>;
    unavailableIds: Set<string>;
    onToggle: (seatId: string) => void;
}
