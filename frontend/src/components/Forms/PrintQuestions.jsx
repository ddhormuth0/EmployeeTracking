import React, { useEffect, useState } from "react"
import authHeader from "../services/auth_header"

function PrintQuestions(props) {
    const [scale, setScale] = useState([])
    const [scores, setScores] = useState([])
    const [comments, setComments] = useState([])

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
            let arr = scores;
            arr[index] = value;
            setScores(arr)
        } else {
            let arr = comments;
            arr[index] = value;
            setComments(arr)
        }
    }

    useEffect(() => {
        props.setQuestionNumber(props.questions.length + 1)
        if (props.isScoring) setScale(printScores())
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <form onSubmit={(e) => { handleSubmit(e) }}>
                {props.questions.map(question => {
                    return (
                        <div key={question.question_id}>
                            <h3 className="d-inline-block">{question.question_id + ". " + question.question_phrase}</h3>
                            {!props.isScoring && <button className="d-inline-block position-absolute end-0 me-4 mb-0 btn-close" onClick={() => deleteQuestion(question.question_id)}></button>}
                            <div>
                                {props.isScoring &&
                                    <div className="row">
                                        <div className="col-1">
                                            {scale.map(number => {
                                                return (
                                                    <div key={number}>
                                                        <div>
                                                            <label className="form-check-label me-2" >{number + ". "}</label>
                                                            {/* subtract one from question id so it is at the beginning of the array */}
                                                            <input className="form-check-input" type="radio" name={"question" + question.question_id} value={number} required onChange={() => handleChange(question.question_id - 1, number, true)} /><br />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="col d-flex">
                                            {/* subtract one from question id so it is at the beginning of the array */}
                                            <textarea type="text" className="flex-fill" name={"comment" + question.question_id} onChange={(e) => handleChange(question.question_id - 1, e.target.value, false)} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
                <button type="submit" className="btn btn-secondary mt-5 me-2" style={{ position: "relative", float: "right" }}>Submit</button>
            </form>
        </div>
    )
}

export default PrintQuestions