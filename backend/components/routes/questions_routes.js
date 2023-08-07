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

//for the employees route that allows us to access the forms and create them
router.route("/")
    //we are only getting questions that belong to the selected form
    .get(async (req, res) => {
        //get all questions from the specified form
        const formID = req.query.formID
        pool.getConnection((err, conn) =>{
            if(err) throw err

            const qry = "SELECT question_id, question_phrase FROM questions WHERE form_id=?"

            conn.query(qry, [formID] ,(error, result)=>{
                //end connection
                conn.release()
                //if there is an error throw it
                if(error) throw err;
                //send the result
                res.json(result);
            })
        })

    })
    //add a new question
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    .post([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //get the information that we want to add
        const questionID = req.body.questionID
        const formID = req.body.formID
        const questionPhrase = req.body.questionPhrase

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO questions (question_id, form_id, question_phrase) VALUES (?, ?, ?)"
            //run the insert command
            conn.query(insertQry, [questionID, formID, questionPhrase], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })


    })
    //delete an employee
    //uses body requests, it does not say this is bad but it could be looked into
    .delete([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //get the information that we want to delete
        const formID = req.body.formID
        const questionID = req.body.questionID
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            const qry = "DELETE FROM forms WHERE form_id=? AND question_id = ?"
            //run the delete command
            conn.query(qry, [formID, questionID], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

//exports our routes
module.exports = router