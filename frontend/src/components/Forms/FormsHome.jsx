import React, { useState, useEffect } from "react"
import AddForm from "./AddForm"
import DeleteForm from "./DeleteForm"

function Forms() {
    //our states to get the forms data
    const [formData, setFormData] = useState([])
    //the state tracker checks if items were removed or deleted, this will refresh the page
    const [stateTracker, setStateTracker] = useState(false)
    const [formToDelete, setFormToDelete] = useState(0)


    //the information we are getting from the backend
    useEffect(() => {
        //get request
        fetch(process.env.REACT_APP_PROXY + "/forms")
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(data => { setFormData(data) })
            //catches errors
            .catch(err => console.log(err))
    }, [stateTracker])
    // [] at the end determines when to make the request, [ ] by itself only makes the request once

    //return the html
    return (
        <div>
            {/*if journal is being selected to delete display this, also pass the parents function into the props*/}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <DeleteForm state={stateTracker} changeState={setStateTracker} form_id={formToDelete} />
            </div>
            <div className="mt-5 row">
                {/* header row */}
                <div className="col-lg-3"></div>

                <div className="col-12 col-lg-6">
                    <div className="d-grid">
                        <button className="btn btn-primary" type="button" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">Add Form</button>
                        <div className="modal" id="addEmployeeModal" tabIndex="-1" aria-hidden="true">
                            {stateTracker && <AddForm state={stateTracker} changeState={setStateTracker} />}
                            {!stateTracker && <AddForm state={stateTracker} changeState={setStateTracker} />}
                        </div>

                    </div>
                </div>



            </div>
            {formData.map(form => {
                return (
                    <div key={form.form_id} className="row px-4 my-5 position-relative">
                        <div className="col-lg-4 col-md-2" />
                        <div className="card col-12 col-md-8 col-lg-4 my-0 p-0">
                            <div className="card-header text-bg-white">
                                <h5 className="ms-0 mb-0 d-inline-block">{form.fName == null ? "Unknown" : form.fName.substring(0, 1) + ". " + form.lName}</h5>
                                <button data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" className="d-inline-block position-absolute end-0 me-4 mb-0 btn-close" aria-label="Close" onClick={() => setFormToDelete(form.form_id)}></button>
                            </div>
                            <div className="card-body">
                                <h2 className="text-center">{form.title}</h2>
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Forms