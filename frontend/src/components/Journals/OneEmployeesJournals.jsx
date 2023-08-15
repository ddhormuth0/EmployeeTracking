import React from "react"
import JournalsHome from "./JournalsHome"
/**
 * Prints out one employees journals
 * @param {object} props 
 * @param {integer} props.id employee id that is selected
 * @example <OneEmployeesJournals id={clickedEmployee} />
 * @returns 
 */
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