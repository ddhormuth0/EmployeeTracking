import React, { useEffect, useState } from "react";
import MediaQuery from "react-responsive";
import OneEmployeesJournals from "../Journals/OneEmployeesJournals";
import AddEmployee from "./AddEmployee";
import DeleteEmployee from "./DeleteEmployee";

//add render for above 600 px and add render for below 600 px

function PrintEmployees() {
    const [employees, setEmployees] = useState([]);
    //send this with get request to order page
    const [orderBy, setOrderBy] = useState("Order By");
    const [clickedEmployee, setClickedEmpoyee] = useState("")
    const [stateTracker, setStateTracker] = useState(false)

    //the information we are getting from the backend
    useEffect(() => {
        //get request
        fetch(process.env.REACT_APP_PROXY + "/employees?orderBy=" + orderBy)
            //turns data into json
            .then(res => res.json())
            //sets the employee data to the data we can use in the state
            .then(employeesData => setEmployees(employeesData))
            //catches errors
            .catch(err => console.log(err));
        //if we change the order by or if we change the length of the eemployees
    }, [orderBy, stateTracker]);
    // [] at the end determines when to make the request, [ ] by itself only makes the request once

    //returns our data in html
    return (
        <div>
            {/* if the employee overlay is toggled then display it */}
            <div className="modal fade p-0" id="journalsModal" tabIndex="-1" aria-hidden="true">
                <OneEmployeesJournals id={clickedEmployee} />
            </div>
            <div className="my-5 row">
                <div className="col-lg-3"></div>

                <div className="col-12 col-lg-6">
                    <div className="row mx-2">
                        <div className="dropdown col-12 col-sm-4 d-grid py-1">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{orderBy}</button>
                            <ul className="dropdown-menu">
                                {/*When a button is clicked, it changes the orderBy state so that the order can be changed in the get request */}
                                <li><button onClick={() => setOrderBy("First Name")} className="dropdown-item">First Name</button></li>
                                <li><button onClick={() => setOrderBy("Last Name")} className="dropdown-item">Last Name</button></li>
                                <li><button onClick={() => setOrderBy("Total")} className="dropdown-item">Total</button></li>
                                <li><button onClick={() => setOrderBy("Good")} className="dropdown-item">Good</button></li>
                                <li><button onClick={() => setOrderBy("Info")} className="dropdown-item">Info</button></li>
                                <li><button onClick={() => setOrderBy("Bad")} className="dropdown-item">Bad</button></li>
                            </ul>
                        </div>
                        <div className="col-6 col-sm-4 d-grid py-1">
                            <button className="btn btn-primary" type="button" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">Add Employee</button>
                            <div className="modal" id="addEmployeeModal" tabIndex="-1" aria-hidden="true">
                                {stateTracker && <AddEmployee state={stateTracker} changeState={setStateTracker} />}
                                {!stateTracker && <AddEmployee state={stateTracker} changeState={setStateTracker} />}
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 d-grid py-1">
                            <button className="btn btn-danger" type="button" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete Employee</button>
                            <div className="modal" id="deleteEmployeeModal" tabIndex="-1" aria-hidden="true">
                                {stateTracker && <DeleteEmployee state={stateTracker} changeState={setStateTracker} />}
                                {!stateTracker && <DeleteEmployee state={stateTracker} changeState={setStateTracker} />}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            
            <table className="table table-light table-hover">
                <thead>
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Total Journals</th>
                        <MediaQuery minWidth={600}>
                            <th scope="col">Good Journals</th>
                            <th scope="col">Info Journals</th>
                            <th scope="col">Bad Journals</th>
                        </MediaQuery>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        //on click we are going to pass the emplooyee_id to the setClickedEmployee and activate the overlay
                        <tr key={employee.employee_id} aria-expanded="false" data-bs-toggle="modal" data-bs-target="#journalsModal" onClick={() => { setClickedEmpoyee(employee.employee_id); }}>
                            <td>{employee.fName}</td>
                            <td>{employee.lName}</td>
                            <td>{employee.numOfTotal}</td>
                            {/* if the screen is above 600px display this information */}
                            <MediaQuery minWidth={600}>
                                <td>{employee.numOfGood}</td>
                                <td>{employee.numOfInfo}</td>
                                <td>{employee.numOfBad}</td>
                            </MediaQuery>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default PrintEmployees;
