
import React, { useState, useEffect } from "react"
import WriteJournals from "./WriteJournals"
import PrintJournals from "./PrintJournals"
/**
 * Prints out all journals, prints out one employees journal if parent = oneEmp
 * @param {object} props 
 * @param {integer} props.id the id of the employee we want to print journals for 
 * @param {attribute} props.parent oneEmp if it is printing one employees journal, null if printing all
 * @example 
 * <JournalsHome parent="oneEmp" id={props.id} />
 * <JournalsHome />
 * @returns 
 */
function Journals(props) {
    //our states to get the journal data
    const [journals, setJournals] = useState([])
    //this state will be switched everytime in order to reset the journal flow
    const [stateTracker, setStateTracker] = useState(false)
    //option to show all journals, good journals, bad journals, or infor journals
    const [show, setShow] = useState("Show")
    //get todays date
    const today = new Date()
    //get a year agos date
    const yearAgo = new Date()
    yearAgo.setDate(yearAgo.getDate() - 365)
    //dates to do journals for, first is the week ago date
    const [startDate, setStartDate] = useState(yearAgo.toISOString().substring(0, 10))
    //this is todays date
    const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10))
    const [fromToAPIString, setFromToAPIString] = useState("&from=" + startDate + "&to=" + endDate)

    var findEmployee

    //if props.oneEmployee does not exist then we display all messages else display that employees messages
    if (props.id === undefined) {
        findEmployee = ""
    } else {
        findEmployee = "&employee_id=" + props.id
    }

    //the information we are getting from the backend
    useEffect(() => {
        //get request
        fetch(process.env.REACT_APP_PROXY + "/journals?show=" + show + fromToAPIString + findEmployee)
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(journalData => { setJournals(journalData) })
            //catches errors
            .catch(err => console.log(err))
    }, [findEmployee, stateTracker, show, fromToAPIString])
    // [] at the end determines when to make the request, [ ] by itself only makes the request once

    //if the new date is empty then keep it the same
    function shouldResetEnd(date) {
        if (date === "") {
            alert("Please Enter a Valid Date")
        } else {
            setEndDate(date)
            setFromToAPIString("&from=" + startDate + "&to=" + date)
        }
    }

    //if the new date is empty then keep it the same
    function shouldResetStart(date) {
        if (date === "") {
            alert("Please DO NOT Use Backspace")
        } else {
            setStartDate(date)
            setFromToAPIString("&from=" + date + "&to=" + endDate)
        }
    }

    //return the html
    return (
        <div>
            <div className="mt-5 row">
                <div className="col-lg-3"></div>

                <div className="col-12 col-lg-6">
                    <div className="row mx-2">
                        <div className="dropdown col-6 d-grid">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {show}
                            </button>
                            <ul className="dropdown-menu">
                                {/*When a button is clicked, it changes the show state so that the order can be changed in the get request */}
                                <li><button onClick={() => setShow("All")} className="dropdown-item">All</button></li>
                                <li><button onClick={() => setShow("Good")} className="dropdown-item">Good</button></li>
                                <li><button onClick={() => setShow("Info")} className="dropdown-item">Info</button></li>
                                <li><button onClick={() => setShow("Bad")} className="dropdown-item">Bad</button></li>
                            </ul>
                        </div>
                        <div className="col-6 d-grid">
                            {props.parent !== "oneEmp" && <button data-bs-toggle="modal" data-bs-target="#addJournalModal" type="button" className="btn btn-primary">Add Journal</button>}
                        </div>
                        <div className="col-6 d-grid">
                            <label>From:</label>
                            <input type="date" value={startDate} className="btn btn-secondary" onChange={(e) => shouldResetStart(e.target.value)}></input>
                        </div>
                        <div className="col-6 d-grid">
                            <label>To:</label>
                            <input type="date" value={endDate} className="btn btn-secondary" onChange={(e) => shouldResetEnd(e.target.value)}></input>
                        </div>
                    </div>
                </div>

            </div>
            <div className="modal fade" id="addJournalModal" tabIndex="-1" aria-labelledby="addJournalModal" aria-hidden="true">
                {/* should reset journal after submitting */}
                {!stateTracker && <WriteJournals changeState={setStateTracker} state={stateTracker} />}
                {stateTracker && <WriteJournals changeState={setStateTracker} state={stateTracker} />}
            </div>
            <PrintJournals parent={props.parent} journalsToPrint={journals} changeState={setStateTracker} state={stateTracker} />
        </div>
    )
}

export default Journals