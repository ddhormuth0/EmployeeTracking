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
        let qry = `SELECT score_info.score_info_id, score_info.form_id, employees.fName, employees.lName, score_info.s_date, forms.title, giver.fName AS g_fName, giver.lName AS g_lName, forms.scale
                FROM score_info
                JOIN employees ON employees.employee_id = score_info.receiving_id
                LEFT JOIN employees AS giver ON giver.employee_id = score_info.giving_id
                JOIN forms ON forms.form_id = score_info.form_id`
        let orderBy = " ORDER BY s_date DESC, score_info_id"
                        //if score_info_id exists then find it
        //DON'T THINK THIS IS NEEDED
        // if (req.query.score_info_id != null) {
        //     const qry = `SELECT employees.fName, employees.lName, score_info.s_date, forms.title, giver.fName AS g_fName, giver.lName AS g_lName
        //             FROM score_info
        //             JOIN employees ON employees.employee_id = score_info.receiving_id
        //             JOIN employees AS giver ON employees.employee_id = score_info.giving_id
        //             JOIN forms ON forms.form_id = score_info.form_id
        //             WHERE score_info.score_info_id=?`

        //     pool.getConnection((err, conn) => {
        //         if (err) throw err //not connected
        //         //query the database
        //         //if you use qrt, [endQry] it does not work because it adds ''
        //         conn.query(qry, [req.query.score_info_id], function (error, result, fields) {
        //             //send the result in a json
        //             conn.release()
        //             if (error) throw error
        //             res.json(result)
        //         })
        //     })

        /* } else */
        if (req.query.form_id != null && req.query.receiving_id != null) {
            //isnt being used yet
            let qryWhere = " WHERE form_id=? AND receiving_id=?"
            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                //if you use qrt, [endQry] it does not work because it adds ''
                conn.query(qry + qryWhere + orderBy, [req.query.form_id, req.query.receiving_id], function (error, result, fields) {
                    //send the result in a json
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
            //get all
        } else {

            pool.getConnection((err, conn) => {
                if (err) throw err //not connected
                //query the database
                //if you use qrt, [endQry] it does not work because it adds ''
                conn.query(qry + orderBy, function (error, result, fields) {
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
    .post([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {
        //connect to the database
        //THIS NEEDS TO BE EDITED WHEN SWITCHED TO POSTGRESQL
        pool.getConnection((err, conn) => {
            if (err) throw err
            //makes this a promise so it is done first
            function insertInfo() {
                return new Promise(function (resolve, reject) {
                    const insertQry = "INSERT INTO employee_tracker.score_info (form_id, giving_id, receiving_id, s_date) VALUES (?, ?, ?, ?);"
                    //run the insert
                    conn.query(insertQry, [req.body.form_id, req.body.giving_id, req.body.receiving_id, req.body.date], (error, result) => {
                        //normally wed close the connection here but we need another one
                        if (error) {
                            conn.release()
                            reject(error)
                        }
                    })
                    resolve();
                })
            }
            //insert then get ID
            insertInfo().then(() => {
                const getLastId = "SELECT LAST_INSERT_ID() AS ID"
                conn.query(getLastId, (error, result) => {
                    conn.release()
                    if (error) throw error
                    console.log(result)
                    res.json(result)
                })
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