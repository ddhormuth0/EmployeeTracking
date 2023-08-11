import React from "react"
import authHeader from "../services/auth_header"

function DeleteForm(props) {

    function deleteScore() {

        //stops page from refreshing after submit
        // evt.preventDefault()

        //sends the delete request
        fetch(process.env.REACT_APP_PROXY + "/score-info?score_info_id=" + props.scoreToDelete, {
            //type of method we are doing
            method: "DELETE",
            //type of information we are sending
            headers: { "Content-Type": "application/json", "x-access-token": authHeader() },
        })
            //if props state is true then we set it to false, and vice versa, this will reload the journals
            .then((response) => {
                props.changeState(props.state ? false : true)
                if (response.status === 401 || response.status === 403) {
                    alert("Requires Admin Account")

                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Delete This Score?</h3>
                </div>
                <div className="modal-body">
                    <p>This action cannot be undone, are you sure you want to delete this Score?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" data-bs-dismiss="modal">No, Go Back</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteScore()}>Yes, Delete It</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteForm