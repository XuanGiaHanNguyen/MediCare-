const database = require("../connect")
const express = require("express")

let requestRoute = express.Router()

// Create Request 
requestRoute.route("/request").post(
    async (request, response) => {
        let db = database.getDB()
        let postObject = {
            staff: request.body.staff, 
            patient: request.body.patient, 
            condition: request.body.condition,
            status: request.body.status
        }
        let data = await db.collection("request").insertOne(postObject)
        
    }

)

// Show Request


// Seen Request 

module.exports = requestRoute
