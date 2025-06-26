const database = require("../connect")
const express = require("express")

let requestRoute = express.Router()

// Create Request 
requestRoute.route("/request").post(
    async (request, response) => {
        let db = database.getDB()

        const availField = ["staff", "patient", "condition", "status", "date", "time"]
        let mongoObject = {}
        for (let field of availField){
            mongoObject[field] = request.body[field]!== undefined ? request.body[field] : null;
        }
        
        let data = await db.collection("request").insertOne(mongoObject)
        response.json(data)
        
    }

)

// Show Request


// Seen Request 

module.exports = requestRoute
