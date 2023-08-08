import React, { useEffect, useState } from "react"
import SearchEmployees from "../Search/SearchEmployees"
import authHeader from "../services/auth_header"

function WriteJournals(props) {

    // const [employeeFullName, setEmployeeFullName] = useState("")
    const [employeeID, setEmployeeID] = useState("")
    const [newJournalDate, setNewJournalDate] = useState("")
    const [journalType, setJournalType] = useState("Type")
    const [info, setInfo] = useState("")
    const [cardColor, setCardColor] = useState("")
    const [showInfo, setShowInfo] = useState(false)
    const [showInfoGiving, setShowInfoGiving] = useState(false)
    const [employeeIDGiving, setEmployeeIDGiving] = useState("")
    const [isReady, setIsReady] = useState(false)
    const [dismiss, setDismiss] = useState("")

    //update if we should submit the journal
    useEffect(()=>{
        shouldSubmit()
    //if any of the states change then run shouldSubmit
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newJournalDate, journalType, info, employeeID, employeeIDGiving])

    function submitJournal(evt) {

        //stops page from refreshing after submit
        evt.preventDefault()

        //if nothing is udefined do the submission
        if (!isReady) {
            alert("Please Fill Out the Entire Journal Form")
        }
        else {
            //object we are going to send/post
            const journal = {
                receivingID: employeeID,
                journalTypeInfo: journalType,
                journalDate: newJournalDate,
                content: info,
                givingID: employeeIDGiving
            }

            fetch(process.env.REACT_APP_PROXY + "/journals", {
                //type of method we are doing
                method: "POST",
                //type of information we are sending
                headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
                //data we are sending
                body: JSON.stringify(journal)
                //if props state is true then we set it to false, and vice versa, this will reload the journals
            }).then((response) => { 
                props.changeState(props.state ? false : true) 
                if (response.status === 401 || response.status === 403) {
                    alert("Requires Admin Account")

                }
            })
                .catch(err =>  console.log(err))
        }

    }

    //this will be called inside the button that submits the journal
    function shouldSubmit(){
        if (info === "" || employeeIDGiving === "" || journalType === "Type" || employeeID === "" || newJournalDate === "") {
            setDismiss("")
            setIsReady(false)
        }else {
            //when the correct information is entered, it is ready to submit
            setIsReady(true)
            setDismiss("modal")
        }
    }


    return (

        <div className="modal-dialog">
            {/* centers the journals */}
            {/* FIX SUBMISSION OF JOURNAL WHEN BACK */}
            <div className="modal-content">
                <div className={"modal-header " + cardColor}>
                    <button className="btn btn-secondary dropdown-toggle ms-0 mb-0 d-inline-block" type="button" data-bs-toggle="dropdown" aria-expanded="false">{journalType}</button>
                    <button type="button" className="btn btn-secondary" style={{ position: "relative", float: "right" }} onClick={submitJournal} data-bs-dismiss={dismiss}>Add Journal</button>
                    <ul className="dropdown-menu">
                        {/*When a button is clicked, it changes the orderBy state so that the order can be changed in the get request */}
                        <li><button onClick={() => { setJournalType("Good"); setCardColor("text-bg-primary") }} className="dropdown-item">Good</button></li>
                        <li><button onClick={() => { setJournalType("Info"); setCardColor("text-bg-white") }} className="dropdown-item">Info</button></li>
                        <li><button onClick={() => { setJournalType("Bad"); setCardColor("text-bg-danger") }} className="dropdown-item">Bad</button></li>
                    </ul>
                </div>
                <div className="modal-body search-bar-dropdown">
                    <SearchEmployees setID={setEmployeeID} setShow={setShowInfo} show={showInfo} onClickOutside={() => { setShowInfo(false) }} />
                    <textarea className="mt-3 mb-0 p-1 border border-3 text-box" onChange={(e) => setInfo(e.target.value)}></textarea>
                </div>
                <div className="modal-footer">
                    <input type="date" className="d-inline-block mb-0 ms-0" onChange={(e) => setNewJournalDate(e.target.value)}></input>
                    <SearchEmployees state={props.state} setState={props.setStateTracker} classItem={{ position: "relative", float: "right" }} setID={setEmployeeIDGiving} setShow={setShowInfoGiving} show={showInfoGiving} onClickOutside={() => { setShowInfoGiving(false) }} />
                </div>
            </div>
        </div>
    )

}

export default WriteJournals