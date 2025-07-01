const database = require("../connect")
const express = require("express")

let requestRoute = express.Router()

// Create Request 
requestRoute.route("/request").post(
    async (request, response) => {
        let db = database.getDB()

        const availField = ["staff", "patient", "condition", "status", "date", "time", "staffSeen", "patientSeen"]
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
        response.json(data)
    }
)

//Show Staff Request 
requestRoute.route("/request/staff/:id").get(
    async (request, response) => {
        let db = database.getDB()
        const data = await db.collection("request").findOne({staff: request.params.id})
        response.json(data)
        
    }
)


// Seen Request 
requestRoute.route("/request/:id").put(
    async (request, response) => {
        let db = database.getDB()

        const updateObject = {
            $set: {
                patientSeen: true
            }
        }
        
        let data = await db.collection("request").updateOne(
            {patient: request.params.id}, updateObject
        )
        
        response.json(data)
        
    }
)

// Seen Request 
requestRoute.route("/request/staff/:id").put(
    async (request, response) => {
        let db = database.getDB()

        const updateObject = {
            $set: {
                staffSeen: true
            }
        }
        
        let data = await db.collection("request").updateOne(
            {staff: request.params.id}, updateObject
        )
        
        response.json(data)
    }
)

module.exports = requestRoute
