import React from "react"
import FormHome from "./FormsHome"

/**
 * Prints out the form home but as scoring instead of editing forms
 * @returns
 */
function Forms() {
   
    return (
        <FormHome isScoring={true}/>
    )
}

export default Forms