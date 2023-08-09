/* eslint-disable no-unused-vars */
const express = require("express")
const router = express.Router()
const pool = require("../config/db.js")
const authJWT = require("../middleware/auth_JWT.js")

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

//for the employees route that allows us to access the employee table in the db
//it is / because the app adds the "/employees" already
router.route("/")
    //get info based on score_info_id or given form_id and receiving id
    .get(async (req, res) => {
        //if score_info_id exists then find it
        if (req.query.score_info_id != null) {
            const qry = `SELECT * FROM score_info WHERE score_info_id=?`

            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                //if you use qrt, [endQry] it does not work because it adds ''
                conn.query(qry, [req.query.score_info_id], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        } else if (req.query.form_id != null && req.query.receiving_id != null) {
            const qry = `SELECT * FROM score_info WHERE form_id=? AND receiving_id=?`

            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                //if you use qrt, [endQry] it does not work because it adds ''
                conn.query(qry,[req.query.form_id, req.query.receiving_id], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        } else {
            console.error("Not enough information sent with get request")
        }


    })
    //add a new employee
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    .post([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO employee_tracker.score_info (form_id, giving_id, receiving_id, date) VALUES (?, ?, ?, ?);"
            //run the insert command
            conn.query(insertQry, [req.body.form_id, req.body.giving_id, req.body.receiving_id, req.body.date], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })


    })
    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {
        //get the information that we want to add
        const id = req.query.score_info_id
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            const qry = "DELETE FROM employee_tracker.score_info WHERE score_info.score_info_id=?"
            //run the insert command
            conn.query(qry, [id], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

//exports our routes
module.exports = router