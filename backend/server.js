/* eslint-disable no-unused-vars */

//setup npm modules for use0
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const employeeRoutes = require('./components/routes/employee_routes')
const journalRoutes = require('./components/routes/journal_routes')
const signIn = require('./components/routes/sing_in')
const bcrypt = require('bcrypt')


//set up express app
const app = express()
//where we will allow cors
const corsOptions = {
    origin: process.env.CORS,
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//cors lets me send data to the front end
app.use(cors(corsOptions))
//uses the employeeRoutes and journalRoutes components, they hanles all routes given to the server
app.use('/employees', employeeRoutes)
app.use('/journals', journalRoutes)
app.use('/sign-in', signIn)

//start the server on this port
app.listen(process.env.PORT || 5000, function () {
    console.log("Server is running on port 5000")
})