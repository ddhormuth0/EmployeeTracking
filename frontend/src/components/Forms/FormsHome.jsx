import React, { useState, useEffect } from "react"


function Forms() {
    //our states to get the forms data
    const [formData, setFormData] = useState([])

    //the information we are getting from the backend
    useEffect(() => {
        //get request
        fetch(process.env.REACT_APP_PROXY + "/forms")
            //turns data into json
            .then(res => res.json())
            //put the data into the journals state
            .then(data => { setFormData(data)})
            //catches errors
            .catch(err => console.log(err))
    }, [])
    // [] at the end determines when to make the request, [ ] by itself only makes the request once

    //return the html
    return (
        <div>
            <div className="mt-5 row">
            {/* header row */}
                <div className="col-lg-3"></div>

                <div className="col-12 col-lg-6">
                    <div className="d-grid">
                        <button className="btn btn-secondary ">Add Form</button>
                    </div>
                </div>

                

            </div>
            {formData.map(form=>{
                return(
                    <div key={form.form_id} className="row px-4 my-5 position-relative">
                        <div className="col-lg-4 col-md-2" />
                        <div className="card col-12 col-md-8 col-lg-4 my-0 p-0">
                            <div className="card-header text-bg-white">
                                <h5 className="ms-0 mb-0 d-inline-block">{form.fName == null? "Unknown" : form.fName.substring(0,1) + ". " + form.lName}</h5>
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