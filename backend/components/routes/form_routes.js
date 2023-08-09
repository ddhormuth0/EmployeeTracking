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

    .get(async (req, res) => {
        //get all forms
        if(req.query.form_id == null){
            pool.getConnection((err, conn) =>{
            if(err) throw err

            const qry = `SELECT fName, lName, form_id, title
            FROM forms
            LEFT JOIN employees ON forms.employee_creator_id = employees.employee_id`

            conn.query(qry,(error, result)=>{
                //end connection
                conn.release()
                //if there is an error throw it
                if(error) throw err;
                //send the result
                res.json(result);
            })
        })
        //if we are searching for a single id
        } else{
            pool.getConnection((err, conn) =>{
            if(err) throw err

            const qry = `SELECT fName, lName, form_id, title, scale
            FROM forms
            LEFT JOIN employees ON forms.employee_creator_id = employees.employee_id
            WHERE form_id=?`

            conn.query(qry,[req.query.form_id],(error, result)=>{
                //end connection
                conn.release()
                //if there is an error throw it
                if(error) throw err;
                //send the result
                res.json(result);
            })
        })
        }
        

    })
    //add a new employee
    //the first parameter is the token verification and authorization, if they dont return true then we dont get into the post
    .post([authJWT.verifyToken, authJWT.isAdmin],(req, res) => {
        //get the information that we want to add
        const title = req.body.title
        const scale = req.body.scale
        const employee_id = req.body.employee_id

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err

            //set up the string, the ? ? represent variables that we will input later
            const insertQry = "INSERT INTO forms (title, employee_creator_id, scale) VALUES (?, ?, ?)"
            //run the insert command
            conn.query(insertQry, [title, employee_id, scale], (error, result) => {
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
        const form_id = req.query.form_id
        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err
            const qry = "DELETE FROM forms WHERE form_id=?"
            //run the delete command
            conn.query(qry, [form_id], (error, result) => {
                conn.release()
                if (error) throw error
                res.json(result)
            })
        })
    })

//exports our routes
module.exports = router