import React from "react"
import authHeader from "../services/auth_header"

/**
 * Prints the modal that is called to delete a selected form
 * @param {object} props
 * @param {boolean} props.state the state that is changed so that the page is rerendered
 * @param {setState} props.changeState: changes the state
 * @param {object} props.form_id the form that is being targeted by the delete
 * @example <DeleteForm state={stateTracker} changeState={setStateTracker} form_id={formToDelete} />
 * 
 * 
 * */
function DeleteForm(props) {

    /**
     * Makes a delete request to the api to remove the form that matches props.form_id
     */
    function deleteForm() {

        //stops page from refreshing after submit
        // evt.preventDefault()

        //sends the delete request
        fetch(process.env.REACT_APP_PROXY + "/forms?form_id=" + props.form_id, {
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
                    <h3 className="modal-title">Delete This Form?</h3>
                </div>
                <div className="modal-body">
                    <p>It will remove all scores related to the form. This action cannot be undone, are you sure you want to delete this Form?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" data-bs-dismiss="modal">No, Go Back</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteForm()}>Yes, Delete It</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteForm
