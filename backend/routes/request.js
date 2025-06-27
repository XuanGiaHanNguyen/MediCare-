const database = require("../connect")
const express = require("express")

let requestRoute = express.Router()

// Create Request 
requestRoute.route("/request").post(
    async (request, response) => {
        let db = database.getDB()

        const availField = ["staff", "patient", "condition", "status", "date", "time", "seen"]
        let mongoObject = {}
        for (let field of availField){
            mongoObject[field] = request.body[field]!== undefined ? request.body[field] : null;
        }
        
        let data = await db.collection("request").insertOne(mongoObject)
        response.json(data)
        
    }
)

// Show Request
requestRoute.route("/request/:id").get(
    async (request, response) => {
        let db = database.getDB()
        const data = await db.collection("request").findOne({patient: request.params.id})
        if (data) {
            response.json(data)
        } else {
            response.status(404).json({ error: "Data not found." })
        }
    }
)

// Seen Request 

module.exports = requestRoute
