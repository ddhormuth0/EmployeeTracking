import React, { useEffect, useState } from "react"
import authHeader from "../services/auth_header"

/**
 * Prints out the questions of the selected form, and if the form is being graded it will print out dials and text boxes for submission. Also allows for questions to be
 * added if it is not scoring
 * @param {object} props 
 * @param {object[]} props.questions the questions of the selected form
 * @param {object[]} props.givenScores if we are editing scores, these are the original scores that were given
 * @param {integer} props.form_id the form we are printing out questions for
 * @param {function} props.submitScore calls the parent function to submit the given score
 * @param {boolean} props.isScoring determines the layout of the page
 * @param {string} props.dismiss determines if the modal will dimiss on submit
 * @param {integer} props.scale the scale of the questions, so a 3 point scale represents a score of 1 to 3
 * @param {setState} props.setQuestionNumber determines what the next question would be if another were added 
 * @param {boolean} props.state the state that is changed so that the page is rerendered
 * @param {setState} props.changeState: changes the state
 * @example <PrintQuestions dismiss={dismiss} submitScore={submitScore} givenScores={props.givenScores} scale={props.form.scale} changeState={props.changeState} state={props.state} isScoring={props.isScoring} questions={props.questions} setQuestionNumber={setQuestionNumber} form_id={props.form.form_id} />
 * @returns 
 */
function PrintQuestions(props) {
    const [scale, setScale] = useState([])
    const [scores, setScores] = useState([])
    const [comments, setComments] = useState([])
    const [initialSetUp, setInitialSetUp] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        //send all of the data to the parent from here
        let score_info = []
        //loop through the scores and comments and make an array of the objects
        for (let i = 0; i < props.questions.length; i++) {
            let info = {
                //its i plus one because each element in the array is behind by one
                question_id: i + 1,
                score: scores[i],
                //if the comment is null then give it the empty string else return the comment
                comment: comments[i] == null ? "" : comments[i]
            }
            score_info.push(info)
        }
        props.submitScore(score_info)


    }



    function handleChange(index, value, isScore) {
        //if a score is changed set the scores, else set the comments
        if (isScore) {
            let arr = [...scores]
            arr[index] = value
            console.log(arr)
            setScores(arr)
        } else {
            let arr = [...comments]
            arr[index] = value
            setComments(arr)
        }
    }
    //initializes the scores and comments if they were given
    function setScoresAndComments() {
        const updatedScores = [...scores]
        const updatedComments = [...comments]
        //for each score we were given, add them to the comments and scores
        props.givenScores.forEach(score => {
            //-1 on the question, because we are storing question 1 at index 0 and so on
            const index = score.question_id - 1
            
            updatedScores[index] = score.score
            updatedComments[index] = score.comments
        })

        setScores(updatedScores)
        setComments(updatedComments)
    }

    useEffect(() => {
        //if we haven't changed any scores and given score exists, then call the function to initialize scores and comment
        if (!initialSetUp && props.givenScores != null) {
            setScoresAndComments()
            setInitialSetUp(true)
        }
        props.setQuestionNumber(props.questions.length + 1)
        if (props.isScoring) setScale(printScores())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scores, comments, props])

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
            <form onSubmit={(e) => { handleSubmit(e) }}>
                {props.questions.map(question => {
                    return (

                        <div key={question.question_id}>
                            <h3 className="d-inline-block">{question.question_id + ". " + question.question_phrase}</h3>
                            {!props.isScoring && <button type="button" className="d-inline-block position-absolute end-0 me-4 mb-0 btn-close" onClick={() => deleteQuestion(question.question_id)}></button>}
                            <div>
                                {/* if we are scoring print this */}
                                {props.isScoring &&
                                    <div className="row">
                                        <div className="col-1">
                                            {scale.map(number => {
                                                return (
                                                    <div key={number}>
                                                        <div>
                                                            <label className="form-check-label me-2" >{number + ". "}</label>
                                                            {/* subtract one from question id so it is at the beginning of the array */}
                                                            <input className="form-check-input" type="radio" name={"question" + question.question_id} value={number} checked={scores[question.question_id - 1] === number} required onChange={() => handleChange(question.question_id - 1, number, true)} />
                                                            <br />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="col d-flex">
                                            {/* subtract one from question id so it is at the beginning of the array */}
                                            <textarea type="text" className="flex-fill" name={"comment" + question.question_id} value={comments[question.question_id - 1]} onChange={(e) => handleChange(question.question_id - 1, e.target.value, false)} />:
                                        </div>
                                    </div>
                                }
                                {/* if we are viewing the score do this */}
                                {props.isViewingScore &&
                                    <div>
                                        <h5>{"Score: " + props.selectedScores[question.question_id].score}</h5>
                                        <p>{props.selectedScores[question.question_id].comment}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
                {props.isScoring && !props.isViewingScore && <button type="submit" className="btn btn-secondary mt-5 me-2" style={{ position: "relative", float: "right" }} data-bs-dismiss={props.dismiss}>Submit</button>}
            </form>
        </div>
    )
}

export default PrintQuestions