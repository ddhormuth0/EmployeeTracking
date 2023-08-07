import React, {useState} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Employees from "./Employees/EmployeesHome"
import Layout from "./PageLayout/Layout"
import Home from "./Home/Home"
import Journals from "./Journals/JournalsHome"
import Login from "./Login/Login"
import Forms from "./Forms/FormsHome"

function App(){

    //add logged in states here and tak it down the tree
    const [checkAccount, setCheckAccount] = useState(true)

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout checkAccount={checkAccount} setCheckAccount={setCheckAccount}/>}>
                    <Route index element={<Home/>}/>
                    <Route path="employees" element={<Employees />}/>
                    <Route path="journals" element={<Journals />}/>
                    <Route path="sign-in" element={<Login checkAccount={checkAccount} setCheckAccount={setCheckAccount}/>}/>
                    <Route path="forms" element={<Forms />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App