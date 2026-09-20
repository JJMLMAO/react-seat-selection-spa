import  type { SeatSectionProps }  from "./types"
import "./styled.css"
import SectionRow from "../Row"

export default function SeatSection(props: SeatSectionProps) {
    const { sections } = props
    console.log("sections: ", sections)


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
                        />       
                    </div>
                )
            })}
        </>
    )
}
