import React, { useState, useEffect } from "react"
import PrintQuestions from "./PrintQuestions"
import authHeader from "../services/auth_header"
import SearchEmployees from "../Search/SearchEmployees"

function PrintForm(props) {
    //used for adding new questions 
    const [questionPhrase, setQuestionPhrase] = useState("")
    const [questionIsReady, setQuestionIsReady] = useState(false)
    const [questionNumber, setQuestionNumber] = useState(0)
    //used for creating a score
    const [giverID, setGiverID] = useState("")
    const [receiverID, setReceiverID] = useState("")
    const [scoreReady, setScoreReady] = useState(false)
    const [date, setDate] = useState("")
    //sets a modal to be
    const [dismiss, setDismiss] = useState("")
    //also used for creating a score, but more specifically for searching employees
    const [showInfo, setShowInfo] = useState(false)
    const [showInfoGiving, setShowInfoGiving] = useState(false)

    function submitScore(scoresAndComments) {
        if (scoreReady) {
            let score_info = {
                form_id: props.form[0].form_id,
                giving_id: giverID,
                receiving_id: receiverID,
                date: date
            }
            let scoresAsObject

            fetch(process.env.REACT_APP_PROXY + "/score-info", {
                //type of method we are doing
                method: "POST",
                //type of information we are sending
                headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
                //data we are sending
                body: JSON.stringify(score_info)
                //if props state is true then we set it to false, and vice versa, this will reload the journals
            }).then((res) => {

                if (res.status === 401 || res.status === 403) {
                    alert("Requires Admin Account")

                } else {
                    return res.json()
                }
                //get the data back and set the score_info_id
            }).then(data => {
                scoresAsObject = {
                    score_info_id: data[0].ID,
                    scores: scoresAndComments
                }
            })
                .catch(err => console.log(err))
                .then(() => fetch(process.env.REACT_APP_PROXY + "/scores", {
                    //type of method we are doing
                    method: "POST",
                    //type of information we are sending
                    headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
                    //data we are sending
                    body: JSON.stringify(scoresAsObject)
                    //if props state is true then we set it to false, and vice versa, this will reload the journals
                }).then((response) => {
                    //change the state so it can update
                    props.changeState(!props.state)
                    if (response.status === 401 || response.status === 403) {
                        alert("Requires Admin Account")

                    }
                }))
        } else {
            alert("Please enter employee names and date")
        }
    }


    function submitQuestion() {
        if (!questionIsReady) {
            alert("Please Fill Out The Question Phrase")
        } else {
            //object we are going to send/post
            const question = {
                question_id: questionNumber,
                form_id: props.form[0].form_id,
                question_phrase: questionPhrase
            }
            //reset the question phase back to nothing
            setQuestionPhrase("")
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
            setQuestionIsReady(false)
        } else {
            setQuestionIsReady(true)
        }

        if (receiverID === "" || giverID === "" || date === "") {
            setScoreReady(false)
            setDismiss("")
        } else {
            setScoreReady(true)
            setDismiss("modal")
        }
    }, [giverID, questionPhrase, receiverID, date])

    return (
        <div>
            {props.form.map(form => {
                return (
                    <div key={form.form_id}>

                        <h1>{form.title}</h1>
                        <PrintQuestions dismiss={dismiss} submitScore={submitScore} scale={form.scale} changeState={props.changeState} state={props.state} isScoring={props.isScoring} questions={props.questions} setQuestionNumber={setQuestionNumber} form_id={form.form_id} />
                        {props.isScoring ?
                            (
                                <div>
                                    <h4>Employee Giving:</h4>
                                    <SearchEmployees setID={setGiverID} setShow={setShowInfoGiving} show={showInfoGiving} onClickOutside={() => { setShowInfoGiving(false) }} />
                                    <h4>Employee Receiving:</h4>
                                    <SearchEmployees setID={setReceiverID} setShow={setShowInfo} show={showInfo} onClickOutside={() => { setShowInfo(false) }} />
                                    <h4>Date:</h4>
                                    <input type="date" onChange={(e) => setDate(e.target.value)} />
                                </div>
                            ) : (
                                <div>
                                    <input type="text" className="me-3" value={questionPhrase} onChange={(e) => setQuestionPhrase(e.target.value)} />
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