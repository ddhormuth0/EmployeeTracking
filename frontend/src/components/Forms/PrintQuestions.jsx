import React, { useEffect } from "react"
import authHeader from "../services/auth_header"

function PrintQuestions(props) {
    useEffect(()=>{
        props.setQuestionNumber(props.questions.length+1)
    })

    function deleteQuestion(questionID){
        const question ={
            form_id: props.form_id,
            question_id: questionID
        }

        fetch(process.env.REACT_APP_PROXY + "/questions", {
            //type of method we are doing
            method: "DELETE",
            //type of information we are sending
            headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
            //data we are sending
            body: JSON.stringify(question)
            //if props state is true then we set it to false, and vice versa, this will reload the journals
        }).then((response) => {
            //change the state so it can update
            props.changeState(!props.state)
            if (response.status === 401 || response.status === 403) {
                alert("Requires Admin Account")

            }
        })
            .catch(err => console.log(err))
    }

    return (
        <div>
            {props.questions.map(question => {
                return (
                    <div key={question.question_id}>
                        <h3 className="d-inline-block">{question.question_id + ". " + question.question_phrase}</h3>
                        
                        {props.isScoring?(
                            <div>

                            </div>
                        ):(
                            <button className="d-inline-block position-absolute end-0 me-4 mb-0 btn-close" onClick={() => deleteQuestion(question.question_id)}></button>
                        )

                        }
                    </div>
                )
            })}

        </div>
    )
}

export default PrintQuestions