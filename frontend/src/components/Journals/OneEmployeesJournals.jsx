import React from "react"
import JournalsHome from "./JournalsHome"

function OneEmployeesJournals(props) {

    return (
        <div className="modal-dialog modal-xl">
            <div className="modal-content">
                <div className="modal-body">
                    <JournalsHome parent="oneEmp" id={props.id} />
                </div>
            </div>
        </div>


    )
}

export default OneEmployeesJournals