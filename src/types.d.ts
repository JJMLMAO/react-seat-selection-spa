export type SeatStatus = "available" | "unavailable"
export type SectionId =
    "alpha" |
    "beta" |
    "charlie" |
    "delta"

export interface Seat {
    id: string,
    number: number,
    price: number,
    status: SeatStatus
}

export interface Row {
    id: string,
    label: string,
    seats: Seat[]
}

export interface Section {
    id: SectionId,
    name: string, // we can add a map later
    rows: Row[]
}

export interface Seatmap {
    eventId: string,
    eventName: string,
    venue: string,
    sections: Section[]
}

export interface SeatWithContext extends Seat {
    sectionId: SectionId;
    sectionName: string;
    rowLabel: string;
}