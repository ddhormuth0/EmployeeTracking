import React, { useEffect } from "react"

function PrintQuestions(props) {
    useEffect(()=>{
        props.setQuestionNumber(props.questions.length+1)
    })

    return (
        <div>
            {props.questions.map(question => {
                return (
                    <div key={question.question_id}>
                        <h3>{question.question_id + ". " + question.question_phrase}</h3>
                        
                        {props.isScoring?(
                            <div>

                            </div>
                        ):(
                            <div>

                            </div>
                        )

                        }
                    </div>
                )
            })}

        </div>
    )
}

export default PrintQuestions