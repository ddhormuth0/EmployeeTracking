/* eslint-disable no-unused-vars */
const express = require("express")
const router = express.Router()
const pool = require("../config/db.js")
const authJWT = require("../middleware/auth_JWT")

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

//for the employees route that allows us to access the forms and create them
router.route("/")
    //we are only getting questions that belong to the selected form
    .get(async (req, res) => {
        //get all questions from the specified form
        const formID = req.query.form_id
        pool.getConnection((err, conn) => {
            if (err) throw err

            const qry = "SELECT question_id, question_phrase FROM questions WHERE form_id=?"

            conn.query(qry, [formID], (error, result) => {
                //end connection
                conn.release()
                //if there is an error throw it
                if (error) throw err;
                //send the result
                res.json(result);
            })
        })

    })
    //add a new question
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    .post([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {
        //get the information that we want to add
        const question_id = req.body.question_id
        const form_id = req.body.form_id
        const question_phrase = req.body.question_phrase

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO questions (question_id, form_id, question_phrase) VALUES (?, ?, ?)"
            //run the insert command
            conn.query(insertQry, [question_id, form_id, question_phrase], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })


    })
    //delete an employee
    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin], (req, res) => {
        //get the information that we want to delete
        const form_id = req.body.form_id
        const question_id = req.body.question_id
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            //makes this a promise so it is done first
            function deleteQuestion() {
                return new Promise(function (resolve, reject) {
                    const qry = "DELETE FROM questions WHERE form_id=? AND question_id = ?"
                    //run the delete command
                    conn.query(qry, [form_id, question_id], (error, result) => {
                        //normally wed close the connection here but we need another one
                        if (error) {
                            conn.release()
                            reject(error)
                        }
                    })
                    resolve();
                })
            }
            //delete first, then update
            deleteQuestion().then(() => {
                const updateQry = "UPDATE questions SET question_id=question_id-1 WHERE form_id=? AND question_id>?"
                conn.query(updateQry, [form_id, question_id], (error, result) => {
                    conn.release()
                    if (error) throw error
                    res.json(result)
                })
            })
        })
    })

//exports our routes
module.exports = router