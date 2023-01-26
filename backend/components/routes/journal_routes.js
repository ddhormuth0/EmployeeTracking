/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const pool = require('./db.js');

//get all journals
//it is / because the app in server.js adds the "/journals" already
router.route("/")
    .get(async (req, res) => {

        //if the employee id is not present give back all data
        if (req.query.employee_id == null) {
            console.log("Requesting Journals");
            pool.getConnection((err, conn) => {
                if (err) throw err; //not connected
                //query the database
                const qry = (
                    `select journals.journal_id, employees.fName, employees.lName, journals.j_date, journals.good_bad_info, journals.content, giver.fName as g_fName, giver.lName as g_lName 
                    from employees 
                    join journals 
                    on employees.employee_id = journals.receiving_id 
                    join employees as giver 
                    on giver.employee_id = journals.giving_id 
                    ORDER BY j_date DESC;`
                );
                conn.query(qry, function (error, result, fields) {
                    //send the result in a json
                    conn.release();
                    if (error) throw error;
                    res.json(result);
                });
            })

        }
        //if the id is present then we will give back on their journals
        else {
            const employee_id = req.query.employee_id;
            console.log("Requesting Journals");
            pool.getConnection((err, conn) => {
                if (err) throw err; //not connected
                //query the database
                const qry = (
                    `select journals.journal_id, employees.fName, employees.lName, journals.j_date, journals.good_bad_info, journals.content, giver.fName as g_fName, giver.lName as g_lName 
                    from employees 
                    join journals 
                    on employees.employee_id = journals.receiving_id 
                    join employees as giver 
                    on giver.employee_id = journals.giving_id 
                    where journals.receiving_id = ?
                    ORDER BY j_date DESC;`
                );
                conn.query(qry, [employee_id], function (error, result, fields) {
                    //send the result in a json
                    conn.release();
                    if (error) throw error;
                    res.json(result);
                });
            })
        }
    })

    .post(async (req, res) => {
        console.log("Adding Journal");
        //information sent to here
        const givingID = req.body.givingID;
        const receivingID = req.body.receivingID;
        const journalDate = req.body.journalDate;
        const journalType = req.body.journalTypeInfo;
        const content = req.body.content;

        pool.getConnection((err, conn) => {
            if (err) throw err; //not connected
            //insertion query
            const newQry = "INSERT INTO employee_tracker.journals (good_bad_info, j_date, receiving_id, giving_id, content) VALUES (?, ?, ?, ?, ?);"

            //run the second query to insert
            conn.query(newQry, [journalType, journalDate, receivingID, givingID, content], function (error, result, fields) {
                conn.release();
                if (error) throw error;
                res.json(result);
            })
        })
    })

    //delete a single journal
    //uses body requests, it does not say this is bad but it could be looked into
    .delete((req, res) => {
        //get the information that we want to add
        console.log("Requested to Delete Journal");
        //information the server is receiving
        const journal_id = req.body.journal_id

        //connect to the database
        pool.getConnection((err, conn) => {
            if (err) throw err;
            //IS BAD FOR PEOPLE WITH THE SAME NAME, DELETES THEM BOTH
            //set up the string, the ? ? represent variables that we will imput later
            const qry = "DELETE FROM employee_tracker.journals WHERE (journal_id=?);"
            //run the insert command
            conn.query(qry, [journal_id], (error, result) => {
                conn.release();
                if (error) throw error;
                console.log("Journal Deleted");
                res.json(result);
            })
        })
    })

//exports our routes
module.exports = router;