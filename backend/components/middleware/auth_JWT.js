/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken")
const pool = require("../config/db.js")

let userId

//sees if a jwt is valid
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  //if there is no token then send this back
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  } else {
    //verify the token, if it is bad then send back unauthorized
    //token is the token we are verifying
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        })
      } else {
        //set the user id
        userId = decoded.id
        //sends the user on to the next matching route
        next()
      }
    })
  }
}
//THIS FUNCTION IS REUSABLE, BUT IM NOT SURE HOW TO DO PROMISES YET SO COME BACK AND FIX IT AFTER
// const getRole = (req, res) => {
//   pool.getConnection((err, conn) => {
//     if (err) throw err //not connected
//     //query the database
//     const qry = "SELECT roles.name FROM users JOIN roles ON users.role = roles.authorization_id WHERE users.user_id =?"

//     if(userId != null){
//       conn.query(qry, [userId], function (error, result) {
//         //send the result in a json
//         conn.release()
//         if (error) throw error
//         return result
//       })
//     } else {
//       console.log("User ID Doesn't Exist")
//     }
    
//   })
// }



const isAdmin = (req, res, next) => {
  let role
  pool.getConnection((err, conn) => {
    if (err) throw err //not connected
    //query the database
    const qry = "SELECT roles.name FROM users JOIN roles ON users.role = roles.authorization_id WHERE users.user_id =?"
    //if for some reason there is Id then its an error
    if(userId != null){
      conn.query(qry, [userId], function (error, result) {
        //send the result in a json
        conn.release()
        if (error) throw error
        
        role = result[0].name
        console.log(role)
        //terrible setup, i just dont know how to use await and promises correctly yet, COME BACK AND FIX
        if (role === "admin") {
          next()
          return
        } else {
          res.status(403).send({
            message: "Require Admin Role!"
          })
        }
      })
    } else {
      res.status(403).send({
        message: "Require Admin Role!"
      })
      console.error("User ID Doesn't Exist")
      role = ""
    }
    
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
}
module.exports = authJwt