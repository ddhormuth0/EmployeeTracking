// must be called like this outside in parent
//if you have two in the same page then you must have two separate show infos
// const [showInfo, setShowInfo] = useState(false)
// <SearchEmployees setID={setEmployeeID} setShow={setShowInfo} show={showInfo} onClickOutside={() => { setShowInfo(false) }} />


import React, { useState, useEffect, useRef } from "react"

function SearchEmployees(props) {

    const ref = useRef(null)
    const { onClickOutside } = props

    const [inputName, setInputName] = useState("")
    //url we will use to get the information in fetch
    const [url, setUrl] = useState("/employees?searching=true")
    const [listOfNames, setListOfNames] = useState([])

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (ref.current && !ref.current.contains(e.target)) {
                onClickOutside && onClickOutside()
            }
        }

        document.addEventListener("click", checkIfClickedOutside, true)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("click", checkIfClickedOutside, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClickOutside])

    useEffect(() => {
        //if the inputName is not empty then we will set the nameArray up
        if (inputName !== "") {
            const nameArray = inputName.split(" ")
            //if the user has only input the first name then only set up firstName
            if (nameArray.length === 1) {
                const firstName = nameArray[0]
                setUrl("/employees?fName=" + firstName)
            } else if (nameArray.length === 2) {
                const firstName = nameArray[0]
                const lastName = nameArray[1]
                setUrl("/employees?fName=" + firstName + "&lName=" + lastName)
            }
        }
        else {
            setUrl("/employees?searching=true")
        }
        fetch(process.env.REACT_APP_PROXY + url)
            .then(res => res.json())
            //sets the employees id
            .then(employeeData => {
                setListOfNames(employeeData)
            })
            //catches errors
            .catch(err => console.log(err))
    }, [props.state, inputName, url])

    const handleChange = (e) => {
        setInputName(e.target.value)
    }

    function handleClick(employee) {
        //return the employee id
        props.setID(employee.employee_id)
        //set the input name to the clicked employee
        setInputName(employee.fName + " " + employee.lName)
        //toggle off the list of names
        onClickOutside && onClickOutside()
    }

    return (
        <div ref={ref} className="search-bar" style={props.classItem}>
            <input className="mx-0 text-center" type="search" value={inputName} onChange={handleChange} onClick={() => { props.setShow(true) }} />
            <ul className="list-group position-absolute">
                {props.show && listOfNames.map(employee => {
                    //this will return the list of employees and also set the employee id when clicked
                    return <li key={employee.employee_id} className="border-2 list-group-item list-group-item-primary list-group-item-action text-center" onClick={() => { handleClick(employee) }}>{employee.fName} {employee.lName}</li>
                })}
            </ul>
        </div>
    )
}

export default SearchEmployees
