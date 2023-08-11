import React, { useState, useEffect } from "react"
import MediaQuery from "react-responsive";
import PrintScoreInfo from "./PrintScoreInfo"
import DeleteScore from "./DeleteScore"

function ScoredForms(props) {
    //our states to get the forms data
    const [stateTracker, setStateTracker] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [allScoreInfo, setAllScoreInfo] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [selectedScores, setSelectedScores] = useState([])
    const [selectedScoreInfo, setSelectedScoreInfo] = useState([])
    const [scoreToDelete, setScoreToDelete] = useState("")

    function setClickedScoreInfo(score_info) {
        setSelectedScoreInfo(score_info)
        //get the questions
        fetch(process.env.REACT_APP_PROXY + "/questions?form_id=" + score_info.form_id)
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(data => { setSelectedQuestions(data) })
            //catches errors
            .catch(err => console.log(err))
        fetch(process.env.REACT_APP_PROXY + "/scores?score_info_id=" + score_info.score_info_id)
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(data => { setSelectedScores(data) })
            //catches errors
            .catch(err => console.log(err))
    }

    //the information we are getting from the backend
    useEffect(() => {
        //get request
        if (selectedQuestions.length === 0 && selectedScores.length === 0) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
        fetch(process.env.REACT_APP_PROXY + "/score-info")
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(data => { setAllScoreInfo(data) })
            //catches errors
            .catch(err => console.log(err))

    }, [selectedQuestions, selectedScores, stateTracker])
    // [] at the end determines when to make the request, [ ] by itself only makes the request once

    //return the html
    return (
        <div>
            {/* if the employee overlay is toggled then display it */}
            <div className="modal fade p-0" id="scoreModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-body">
                            {!isLoading && <PrintScoreInfo score_info={selectedScoreInfo} selectedQuestions={selectedQuestions} selectedScores={selectedScores} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="deleteModal" tabIndex="-1" aria-hidden="true">
                <DeleteScore scoreToDelete={scoreToDelete} state={stateTracker} changeState={setStateTracker} />
            </div>
            <table className="table table-light table-hover">
                <thead>
                    <tr className="">
                        <th scope="col">Receiver</th>
                        <th scope="col">Form</th>
                        <MediaQuery minWidth={600}>
                            <th scope="col">Date</th>
                            <th scope="col">Grader</th>
                        </MediaQuery>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {allScoreInfo.map((score_info) => {
                        let newDate = new Date(score_info.s_date.substring(0, 4), (parseInt(score_info.s_date.substring(5, 7)) - 1).toString(), score_info.s_date.substring(8, 10)).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })
                        return (
                            //on click we are going to pass the employee_id to the setClickedEmployee and activate the overlay
                            <tr key={score_info.score_info_id} aria-expanded="false" data-bs-toggle="modal" data-bs-target="#scoreModal" onClick={() => { setClickedScoreInfo(score_info); }}>
                                <td>{score_info.fName + " " + score_info.lName}</td>
                                <td>{score_info.title}</td>
                                {/* if the screen is above 600px display this information */}
                                <MediaQuery minWidth={600}>
                                    <td>{newDate}</td>
                                    <td>{score_info.g_fName + " " + score_info.g_lName}</td>
                                </MediaQuery>
                                <td>
                                    <button type="button" className="d-inline-block position-absolute end-0 me-4 mb-0 btn-close" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setScoreToDelete(score_info.score_info_id)}></button>
                                </td>
                            </tr>

                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ScoredForms