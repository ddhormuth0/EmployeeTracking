/* eslint-disable no-unused-vars */
const express = require("express")
const router = express.Router()
const pool = require("../config/db.js")
const authJWT = require("../middleware/auth_JWT")

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

//for the employees route that allows us to access the employee table in the db
//it is / because the app adds the "/employees" already
router.route("/")
    //get all employees or a singular employee
    .get(async (req, res) => {
        //find all employees if fName does not exist

        if (req.query.fName == null) {
            if (req.query.searching === 'true') {

                const qry = `SELECT employee_id ,fName, lName
                            FROM employees
                            ORDER BY lName, fName   
                            LIMIT 3`

                pool.getConnection((err, conn) => {
                    if (err) throw err //not connected
                    //query the database
                    //if you use qrt, [endQry] it does not work because it adds ''
                    conn.query(qry, function (error, result, fields) {
                        //send the result in a json
                        conn.release()
                        if (error) throw error
                        res.json(result)
                    })
                })
            } else {

                //get the order by field
                const orderBy = req.query.orderBy
                //string we will add to the end of the query to determine what it will be ordered by
                let qryEnd

                switch (orderBy) {
                    case "Good":
                        qryEnd = "numOfGood DESC, lName, fName"
                        break
                    case "Bad":
                        qryEnd = "numOfBad DESC, lName, fName"
                        break
                    case "Info":
                        qryEnd = "numOfInfo DESC, lName, fName"
                        break
                    case "First Name":
                        qryEnd = "fName, lName"
                        break
                    case "Last Name":
                        qryEnd = "lName, fName"
                        break
                    case "Total":
                        qryEnd = "numOfTotal DESC, lName, fName"
                        break
                    default:
                        qryEnd = "lName, fName"
                        break
                }

                //qry we want to run
                const qry =
                    `SELECT employee_id ,fName, lName, count(good_bad_info) as numOfTotal, SUM(CASE WHEN good_bad_info='good' THEN 1 ELSE 0 END) as numOfGood, SUM(CASE WHEN good_bad_info='bad' THEN 1 ELSE 0 END) as numOfBad, SUM(CASE WHEN good_bad_info='info' THEN 1 ELSE 0 END) as numOfInfo
                    FROM employees
                    LEFT JOIN journals 
                    ON employees.employee_id = receiving_id
                    GROUP BY employee_id
                    ORDER BY `


                pool.getConnection((err, conn) => {
                    if (err) throw err //not connected
                    //query the database
                    //if you use qrt, [endQry] it does not work because it adds ''
                    conn.query(qry + qryEnd + "", function (error, result, fields) {
                        //send the result in a json
                        conn.release()
                        if (error) throw error
                        res.json(result)
                    })
                })
            }
        }
        //if fName does exist and lName does not
        else if (req.query.lName == null) {
            const fName = req.query.fName
            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database for employees whose last name or first name is like the one entered
                const qry = "SELECT employee_id, employees.fName, employees.lName FROM employees WHERE employees.fName LIKE '%" + fName + "%' OR employees.lName LIKE '%" + fName + "%' ORDER BY lName, fName LIMIT 3"
                conn.query(qry, function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        }
        //if there is both a fName and a lName
        else {
            const fName = req.query.fName
            const lName = req.query.lName
            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database for employees whose last name or first name is like the one entered
                const qry = "SELECT employee_id, employees.fName, employees.lName FROM employees WHERE employees.fName LIKE '%" + fName + "%' AND employees.lName LIKE '%" + lName + "%' ORDER BY lName, fName LIMIT 3"
                conn.query(qry, [fName, lName], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        }

    })
    //add a new employee
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    .post([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //get the information that we want to add
        const fName = req.body.fName
        const lName = req.body.lName

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will imput later
            const insertQry = "INSERT INTO employees (fName, lName) VALUES (?, ?)"
            //run the insert command
            conn.query(insertQry, [fName, lName], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })


    })
    //delete an employee
    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //get the information that we want to add
        const id = req.query.employee_id
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            const qry = "DELETE FROM employee_tracker.employees WHERE employees.employee_id=?"
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