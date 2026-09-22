import  type { SeatSectionProps }  from "./types"
import "./styled.css"
import SectionRow from "../Row"

export default function SeatSection(props: SeatSectionProps) {
    const { sections, selectedIds, unavailableIds, onToggle } = props

    return (
        <>
            {sections.map((section) => {
                return (
                    <div className="section-div" key={section.id}>
                        <div className="section-name">
                            {section.name}
                        </div>
                        <SectionRow
                            rows={section.rows}
                            selectedIds={selectedIds}
                            unavailableIds={unavailableIds}
                            onToggle={onToggle}
                        />
                    </div>
                )
            })}
        </>
    )
}
