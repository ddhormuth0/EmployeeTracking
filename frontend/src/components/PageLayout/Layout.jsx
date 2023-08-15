import React from "react"
import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"

/**
 * 
 * @param {object} props 
 * @param {boolean} props.checkAccount sees if the user is logged in
 * @param {setState} props.setCheckAccount sets the checkAccount state
 * @example <Layout checkAccount={checkAccount} setCheckAccount={setCheckAccount} />
 * @returns 
 */
function Layout(props){
    return(
        <>
            <NavBar checkAccount={props.checkAccount} setCheckAccount={props.setCheckAccount}/>
            <Outlet />
        </>
    )
}

export default Layout
