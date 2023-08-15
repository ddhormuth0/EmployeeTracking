import React, { useEffect } from "react"
/**
 * Prints out a static form that cannot be edited
 * @param {object} props 
 * @param {object} props.score_info contains the title, giving and receiving employees, and the date
 * @param {object[]} props.selectedQuestions the questions and their numbers plus phrases
 * @param {object[]} props.selectedScores the scores for each question and their comments
 * @example <PrintScoreInfo score_info={props.selectedScoreInfo} selectedQuestions={props.selectedQuestions} selectedScores={props.selectedScores} />
 * @returns 
 */
function PrintScoreInfo(props) {
    useEffect(() => {
        
    }, [props])

    return (
        <div>

            <div>

                <h1>{props.score_info.title}</h1>
                {/* print questions here with score and comment*/}
                {props.selectedQuestions.map(question => {
                    return (
                        <div key={question.question_id}>
                            <h4>{question.question_id + ". " + question.question_phrase}</h4>
                            {/* subtract one because question one is in index 0 */}
                            <h5>{"Score: " + props.selectedScores[question.question_id - 1].score + "/" + props.score_info.scale}</h5>
                            <p>{props.selectedScores[question.question_id - 1].comments}</p>
                        </div>
                    )
                })}

                <h5>Employee Giving:</h5>
                <h4>{props.score_info.g_fName + " " + props.score_info.g_lName}</h4>
                <h5>Employee Receiving:</h5>
                <h4>{props.score_info.fName + " " + props.score_info.lName}</h4>

                {/* print employees here */}

            </div>



        </div>
    )
}

export default PrintScoreInfo