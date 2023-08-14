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
            const qry = `SELECT * FROM scores WHERE score_info_id=?`

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
        } else {
            console.error("not enough information for get request")
        }
    })
    //add a new employee
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    //I WILL HAVE TO CHANGE THIS WHEN CHANGING TO PostgreSQL
    .put([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {

        let scores = req.body.scores
        let score_info_id = req.body.score_info_id
        let valueString = ""
        //loup through the scores
        scores.forEach(score => {
            valueString += ("(" + "'" + score_info_id + "'" + ", " + "'" + score.question_id + "'" + ", " + "'" + score.score + "'" + ", " + "'" + score.comment + "'" + "),")
        });
        valueString = valueString.substring(0, valueString.length - 1);
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO scores (score_info_id, question_id, score, comments) VALUES" + valueString +
                "ON DUPLICATE KEY UPDATE score = VALUES(score), comments = VALUES(comments);"
            //run the insert command
            conn.query(insertQry, valueString, (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

    .post([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {

        let scores = req.body.scores
        let score_info_id = req.body.score_info_id
        let valueString = ""
        //loup through the scores
        scores.forEach(score => {
            valueString += ("(" + "'" + score_info_id + "'" + ", " + "'" + score.question_id + "'" + ", " + "'" + score.score + "'" + ", " + "'" + score.comment + "'" + "),")
        });
        valueString = valueString.substring(0, valueString.length - 1);
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO scores (score_info_id, question_id, score, comments) VALUES" + valueString + ";"
            //run the insert command
            conn.query(insertQry, valueString, (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            const qry = "DELETE FROM scores WHERE scores.score_info_id=? AND scores.question_id=?"
            //run the insert command
            conn.query(qry, [req.query.score_info_id, req.query.question_id], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

//exports our routes
module.exports = router