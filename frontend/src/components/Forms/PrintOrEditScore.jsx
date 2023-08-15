import React, { useEffect, useState } from "react"
import PrintScoreInfo from "./PrintScoreInfo"
import PrintForm from "./PrintForm";

/**
 * A dynamic page. It prints out scores and questions in a complete page and allows the user to edit or view the scores. Depending on that input, the page changes.
 * @param {object} props 
 * @param {object} props.selectedScoreInfo the score_info that contains the title, date, giving, and receiving employees
 * @param {object[]} props.selectedQuestions the questions of the selected form that will be printed out
 * @param {object[]} props.selectedScores the scores of the selected score_info that include scores and comments
 * @param {boolean} props.state the state that is changed so that the page is rerendered
 * @param {setState} props.changeState: changes the state
 * @example <PrintOrEditScore selectedScoreInfo={selectedScoreInfo} selectedQuestions={selectedQuestions} selectedScores={selectedScores} />
 * @returns 
 */
function Forms(props) {
    const [viewOrEdit, setViewOrEdit] = useState("View")

    useEffect(() => {

    }, [props])

    return (
        <div>
            <div className="row">
                
                <div className="dropdown py-1 px-0">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{viewOrEdit}</button>
                    <ul className="dropdown-menu">
                        {/*When a button is clicked, it changes the orderBy state so that the order can be changed in the get request */}
                        <li><button onClick={() => setViewOrEdit("View")} className="dropdown-item">View</button></li>
                        <li><button onClick={() => setViewOrEdit("Edit")} className="dropdown-item">Edit</button></li>
                    </ul>
                </div>
            </div>

            {/* if we are editing then print the form where we can submit, else print the view */}
            {viewOrEdit === "Edit" ?
                <PrintForm state={props.state} changeState={props.changeState} isScoring={true} form={props.selectedScoreInfo} questions={props.selectedQuestions} givenScores={props.selectedScores} /> :
                <PrintScoreInfo score_info={props.selectedScoreInfo} selectedQuestions={props.selectedQuestions} selectedScores={props.selectedScores} />
            }
        </div>
    )
}

export default Forms