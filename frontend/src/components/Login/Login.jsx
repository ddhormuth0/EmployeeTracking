import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthService from "../services/auth_service"

function Login(props) {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function onSubmit(evt) {
        evt.preventDefault()
        AuthService.login(username, password)
        //if it is succesful navigate back home
        .then(()=>{
            props.setCheckAccount(props.setCheckAccount(props.checkAccount?false:true))
            navigate("/", { replace: true })
        })
        //logs status
        .catch((err)=>{
            alert("Username or Password was Incorrect")
        })
    }

    return (
        <div>
            {/* Title For Home Page */}
            <div>
                <h1 className="mt-5 text-center">Welcome to the Employee Tracker</h1>
            </div>
            {/* login */}
            <div className="my-5 row justify-content-center">
                <div className="border border-5 col-md-3">
                    <h3 className="text-center">Login</h3>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input className="form-control" type="text" name="username" required onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input className="form-control" type="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button className="btn btn-primary mb-2 " type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login