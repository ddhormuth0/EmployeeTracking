import React, {useState} from "react";

function AddEmployee(props) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    //handles the submit request by sending a post request
    function handleSubmit(evt) {
        //stops page from refreshing after submit
        evt.preventDefault();
        //object we are going to send/post
        const employee = {
            fName: firstName,
            lName: lastName
        }

        //sends the post request
        fetch(process.env.REACT_APP_PROXY + "/employees", {
            //type of method we are doing
            method: "POST",
            //type of information we are sending
            headers: { "Content-Type": "application/json" },
            //data we are sending
            body: JSON.stringify(employee)
        }).then(() => {
            props.changeState(props.state ? false : true)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter First Name</label>
                <input type="text" name="fName" required onChange={(change) => setFirstName(change.target.value)} />
                <label>Enter Last Name</label>
                <input type="text" name="lName" required onChange={(change) => setLastName(change.target.value)} />
                <button type="submit">Add Employee</button>
            </form>
        </div>
    );
};

export default AddEmployee;