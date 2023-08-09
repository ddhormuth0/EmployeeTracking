import React, { useEffect, useState } from "react"
import authHeader from "../services/auth_header"

function PrintQuestions(props) {
    const [scale, setScale] = useState([])

    useEffect(() => {
        props.setQuestionNumber(props.questions.length + 1)
        if (props.isScoring) setScale(printScores())
    }, [])

    function deleteQuestion(question_id) {

        fetch(process.env.REACT_APP_PROXY + "/questions?form_id=" + props.form_id + "&question_id=" + question_id, {
            //type of method we are doing
            method: "DELETE",
            //type of information we are sending
            headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
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
    //puts the scale into an array so we can print it 
    function printScores() {
        let scale = []
        for (let i = props.scale; i > 0; i--) scale.push(i)
        return scale
    }

    return (
        <div>
            {props.questions.map(question => {
                return (
                    <div key={question.question_id}>
                        <h3 className="d-inline-block">{question.question_id + ". " + question.question_phrase}</h3>

                        {props.isScoring ? (
                            <div>
                                {scale.map(number => {
                                    return (
                                        <div key={number}>
                                            <label className="form-check-label me-2" >{number + ". "}</label>
                                            <input className="form-check-input" type="radio" name={question.question_id} value={number} /><br/>
                                        </div>

                                    )
                                })}
                            </div>
                        ) : (
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