import React, { useState, useEffect } from "react"
import PrintQuestions from "./PrintQuestions"
import authHeader from "../services/auth_header"
import SearchEmployees from "../Search/SearchEmployees"

/**
 * A dynamic page, based on the isScoring prop it will change. If props.isScoring is true, it will print out the form with radio dials to score the form, else it will print out the form
 * and allow the ability to add or delete questions from the form. If givenScores is not null, then the scoring will have the questions already filled out, allowing the user to edit the 
 * graded form
 * @param {object} props
 * @param {object} props.form - this is either the selected form, or the selected score_info, based on if it is scoring or editing a form
 * @param {object[]} props.givenScores if the scored form is being edited, it will come with all of the original answers and comments
 * @param {object[]} props.questions the questions of the selected form
 * @param {boolean} props.isScoring determines the layout of the page
 * @param {boolean} props.state the state that is changed so that the page is rerendered
 * @param {setState} props.changeState: changes the state
 * @example <PrintForm state={stateTracker} changeState={setStateTracker} isScoring={props.isScoring} form={selectedFormData} questions={formQuestions} /> * 
 * @returns 
 */
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
                form_id: props.form.form_id,
                giving_id: giverID,
                receiving_id: receiverID,
                date: date
            }
            let scoresAsObject
            //if we are given the scores then we are editing and we do not need to send the post request for the score-info, only update the scores
            if (props.givenScores != null) {
                scoresAsObject = {
                    score_info_id: props.form.score_info_id,
                    scores: scoresAndComments
                }
                fetch(process.env.REACT_APP_PROXY + "/scores", {
                    //type of method we are doing
                    method: "PUT",
                    //type of information we are sending
                    headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
                    //data we are sending
                    body: JSON.stringify(scoresAsObject)
                    //if props state is true then we set it to false, and vice versa, this will reload the journals
                }).then((response) => {
                    //change the state so it can update
                    if (props.changeState != null) props.changeState(!props.state)
                    if (response.status === 401 || response.status === 403) {
                        alert("Requires Admin Account")

                    }
                })
                //else we will do the normal one and add it all for the first time
            } else {
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
                        if (props.changeState != null) props.changeState(!props.state)
                        if (response.status === 401 || response.status === 403) {
                            alert("Requires Admin Account")

                        }
                    }))
            }


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
                form_id: props.form.form_id,
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
        //check to see if input is given, if props.givenScores is null then they must be entered
        if ((receiverID === "" || giverID === "" || date === "") && props.givenScores == null) {
            setScoreReady(false)
            setDismiss("")
        } else {
            setScoreReady(true)
            setDismiss("modal")
        }
    }, [giverID, questionPhrase, receiverID, date, props])

    return (
        <div>
            {props.form != null &&
                <div>
                    <h1>{props.form.title}</h1>
                    <PrintQuestions dismiss={dismiss} submitScore={submitScore} givenScores={props.givenScores} scale={props.form.scale} changeState={props.changeState} state={props.state} isScoring={props.isScoring} questions={props.questions} setQuestionNumber={setQuestionNumber} form_id={props.form.form_id} />
                    {props.isScoring ?
                        (
                            <div>
                                <h5>Employee Giving:</h5>
                                {/* if we are given scores then the employee given and employee receiving are already set, so just print them from the form*/}
                                {props.givenScores == null ? <SearchEmployees setID={setGiverID} setShow={setShowInfoGiving} show={showInfoGiving} onClickOutside={() => { setShowInfoGiving(false) }} /> :
                                    <h4>{props.form.g_fName + " " + props.form.g_lName}</h4>
                                }
                                <h5>Employee Receiving:</h5>
                                {props.givenScores == null ? <SearchEmployees setID={setReceiverID} setShow={setShowInfo} show={showInfo} onClickOutside={() => { setShowInfoGiving(false) }} /> :
                                    <h4>{props.form.fName + " " + props.form.lName}</h4>}
                                <h5>Date:</h5>
                                {props.givenScores == null ? <input type="date" onChange={(e) => setDate(e.target.value)} /> :
                                    <h4>{new Date(props.form.s_date.substring(0, 4), (parseInt(props.form.s_date.substring(5, 7)) - 1).toString(), props.form.s_date.substring(8, 10)).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</h4>}
                            </div>
                        ) : (
                            <div>
                                <input type="text" className="me-3" value={questionPhrase} onChange={(e) => setQuestionPhrase(e.target.value)} />
                                <button type="button" className="btn btn-secondary" onClick={submitQuestion} >Add Question</button>
                            </div>
                        )}
                </div>}


        </div>
    )
}

export default PrintForm