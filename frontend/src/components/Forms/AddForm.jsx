import React, { useState, useEffect } from "react"
import authHeader from "../services/auth_header"
import SearchEmployees from "../Search/SearchEmployees"

/**
 * Prints the modal that creates a form and adds it to the database
 * @param {object} props 
 * @param {boolean} props.state state variable that triggers rerenders
 * @param {setState} props.changeState function that sets the current value of the state variable
 * @example <AddForm state={stateTracker} changeState={setStateTracker} />
 * @returns 
 */
function AddForm(props) {

    const [title, setTitle] = useState("")
    const [scale, setScale] = useState("")
    //is ready will see if the journal is ready to submit
    const [isReady, setIsReady] = useState("false")
    //dismiss sets the string that dismisses the modal
    const [dismiss, setDismiss] = useState("")
    const [showInfo, setShowInfo] = useState(false)
    const [employee_id, setEmployee_id] = useState("")

    //update if we should submit the journal
    useEffect(() => {
        shouldSubmit()
        //if any of the states change then run shouldSubmit
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, scale, employee_id])

    /**
     * On click of a button, this will submit the form to be graded
     * @param {object} evt - used as evt.preventDefault() to stop page refresh
     */
    function handleClick(evt) {
        //stops page from refreshing after submit
        evt.preventDefault()

        if (!isReady) {
            alert("Please fill out the entire form")
        }
        else {
            //object we are going to send/post
            const employee = {
                title: title,
                scale: scale,
                employee_id: employee_id
            }

            //sends the post request
            fetch(process.env.REACT_APP_PROXY + "/forms", {
                //type of method we are doing
                method: "POST",
                //type of information we are sending
                headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
                //data we are sending
                body: JSON.stringify(employee)
            }).then((response) => {
                props.changeState(props.state ? false : true)
                setEmployee_id("")
                setTitle("")
                setScale("")
                if (response.status === 401 || response.status === 403) {
                    alert("Requires Admin Account")
                }
            }).catch((err) => console.log(err))
        }
    }
    /**
     * Checks to see if a form is ready to submit. If employee_id, title, or scale are blank then it does not submit
     */
    function shouldSubmit() {
        if (employee_id === "" || title === "" || scale === "") {
            setDismiss("")
            setIsReady(false)
        } else {
            //when the correct information is entered, it is ready to submit
            setIsReady(true)
            setDismiss("modal")
        }
    }

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">Add Form</h1>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label className="me-3">Enter Title:</label>
                        <input type="text" name="title" required onChange={(change) => setTitle(change.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="me-3">Enter Grade Scale (1-10): </label>
                        <input type="number" min="1" max="10" name="scale" required onChange={(change) => setScale(change.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="me-3">Form Creator</label>
                        <SearchEmployees state={props.state} setShow={setShowInfo} show={showInfo} setID={setEmployee_id} onClickOutside={() => setShowInfo(false)} />
                    </div>
                    
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Never mind</button>
                    {/* Dismisses the modal only if dismiss is set to modal, that happens when its ready to dismiss*/}
                    <button type="button" className="btn btn-success" data-bs-dismiss={dismiss} onClick={handleClick}>Add {title}</button>
                </div>
            </div>
        </div>
    )
}

export default AddForm