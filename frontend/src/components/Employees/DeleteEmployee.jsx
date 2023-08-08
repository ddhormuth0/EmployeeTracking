import React, { useState } from "react"
import SearchEmployees from "../Search/SearchEmployees"
import authHeader from "../services/auth_header"

function DeleteEmployee(props) {

    const [showInfo, setShowInfo] = useState(false)
    const [employee_id, setEmployee_id] = useState("")

    function handleClick() {
        //stops page from refreshing after submit
        // evt.preventDefault()
        //object we are going to send/post
        const employee = {
            id: employee_id
        }

        //sends the post request
        fetch(process.env.REACT_APP_PROXY + "/employees", {
            //type of method we are doing
            method: "DELETE",
            //type of information we are sending
            headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
            //data we are sending
            body: JSON.stringify(employee)
        }).then((response) => {
            props.changeState(props.state ? false : true)
            if(response.status === 401 || response.status === 403){
                alert("Requires Admin Account")
            }
        }).catch((error)=> console.log(error))
    }

    return (

        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">Delete Employee</h1>
                </div>
                <div className="modal-body">
                    <h4>Are You Sure?</h4>
                    <p>Deletion is permanent. It will also delete any journals where this employee was the receiver.</p>
                    <SearchEmployees state={props.state} setShow={setShowInfo} show={showInfo} setID={setEmployee_id} onClickOutside={() => setShowInfo(false)} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" data-bs-dismiss="modal">No, Go Back</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleClick}>Yes, Delete Employee</button>
                </div>
            </div>
        </div>

    )
}

export default DeleteEmployee