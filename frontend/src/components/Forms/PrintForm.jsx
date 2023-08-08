import React, { useState, useEffect } from "react"
import PrintQuestions from "./PrintQuestions"
import authHeader from "../services/auth_header"

function PrintForm(props) {
    const [questionPhrase, setQuestionPhrase] = useState("")
    const [isReady, setIsReady] = useState(false)
    const [questionNumber, setQuestionNumber] = useState(0)

    function submitQuestion() {
        if (!isReady) {
            alert("Please Fill Out The Question Phrase")
        } else {
            //object we are going to send/post
            const question = {
                question_id: questionNumber,
                form_id: props.form[0].form_id,
                question_phrase: questionPhrase
            }

            fetch(process.env.REACT_APP_PROXY + "/questions", {
                //type of method we are doing
                method: "POST",
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
    }

    useEffect(() => {
        if (questionPhrase === "") {
            setIsReady(false)
        } else {
            setIsReady(true)
        }
    }, [questionPhrase])

    return (
        <div>
            {props.form.map(form => {
                return (
                    <div key={form.form_id}>
                        
                        <h1>{form.title}</h1>
                        <PrintQuestions isScoring={props.isScoring} questions={props.questions} setQuestionNumber={setQuestionNumber} />
                        {props.isScoring ?
                            (
                                <div></div>
                            ) : (
                                <div>
                                    <input type="text" onChange={(e) => setQuestionPhrase(e.target.value)} />
                                    <button type="button" className="btn btn-secondary" onClick={submitQuestion} >Add Question</button>
                                </div>
                            )}
                    </div>
                )
            })}

        </div>
    )
}

export default PrintForm