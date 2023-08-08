/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const pool = require('../config/db.js')
const authJWT = require('../middleware/auth_JWT')

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

//get all journals
//it is / because the app in server.js adds the "/journals" already
router.route("/")
    .get(async (req, res) => {
        var showString

        switch(req.query.show){
            case "All":
                showString = ""
                break
            case "Good":
                showString = " journals.good_bad_info='good' AND "
                break
            case "Info":
                showString = " journals.good_bad_info='info' AND "
                break
            case "Bad":
                showString = " journals.good_bad_info='bad' AND "
                break
            default:
                showString = ""
                break
        }

        //if the employee id is not present give back all data
        if (req.query.employee_id == null) {
            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                const qry = (
                    `SELECT journals.journal_id, employees.fName, employees.lName, journals.j_date, journals.good_bad_info, journals.content, giver.fName as g_fName, giver.lName as g_lName 
                    FROM employees 
                    JOIN journals 
                    ON employees.employee_id = journals.receiving_id 
                    JOIN employees as giver 
                    ON giver.employee_id = journals.giving_id
                    WHERE ` + showString +  ` journals.j_date BETWEEN ? AND ? 
                    ORDER BY j_date DESC`
                )
                conn.query(qry, [req.query.from, req.query.to], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })

        }
        //if the id is present then we will give back on their journals
        else {
            const employee_id = req.query.employee_id
            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                const qry = (
                    `SELECT journals.journal_id, employees.fName, employees.lName, journals.j_date, journals.good_bad_info, journals.content, giver.fName as g_fName, giver.lName as g_lName 
                    FROM employees 
                    JOIN journals 
                    ON employees.employee_id = journals.receiving_id 
                    JOIN employees as giver 
                    ON giver.employee_id = journals.giving_id
                    WHERE ` + showString +  ` journals.receiving_id=? AND journals.j_date BETWEEN ? AND ? 
                    ORDER BY j_date DESC`
                )
                conn.query(qry, [employee_id, req.query.from, req.query.to], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        }
    })

    .post([authJWT.verifyToken, authJWT.isAdmin],async (req, res) => {
        //information sent to here
        const giving_id = req.body.giving_id
        const receiving_id = req.body.receiving_id
        const j_date = req.body.j_date
        const good_bad_info = req.body.good_bad_info
        const content = req.body.content

        pool.getConnection((err, conn) => {
            if (err) throw err //not connected
            //insertion query
            const newQry = "INSERT INTO employee_tracker.journals (good_bad_info, j_date, receiving_id, giving_id, content) VALUES (?, ?, ?, ?, ?)"

            //run the second query to insert
            conn.query(newQry, [good_bad_info, j_date, receiving_id, giving_id, content], function (error, result, fields) {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

    //delete a single journal
    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //information the server is receiving
        const journal_id = req.body.journal_id

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            //IS BAD FOR PEOPLE WITH THE SAME NAME, DELETES THEM BOTH
            //set up the string, the ? ? represent variables that we will input later
            const qry = "DELETE FROM employee_tracker.journals WHERE (journal_id=?)"
            //run the insert command
            conn.query(qry, [journal_id], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

//exports our routes
module.exports = router