import React, { useEffect } from "react"

function PrintScoreInfo(props) {
    useEffect(() => {
        
    }, [props])

    return (
        <div>


            <div key={props.score_info.score_info_id}>

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


                {/* print employees here */}

            </div>



        </div>
    )
}

export default PrintScoreInfo