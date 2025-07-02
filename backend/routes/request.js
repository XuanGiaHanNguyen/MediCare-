const database = require("../connect")
const express = require("express")

let requestRoute = express.Router()

// Create Request 
requestRoute.route("/request").post(
    async (request, response) => {
        let db = database.getDB()

        const availField = ["userId", "type", "title", "message", "data", "isRead", "createdAt"]
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
        const data = await db.collection("request").findOne({userId: request.params.id})
        response.json(data)
    }
)

// Seen Request 
requestRoute.route("/request/:id").put(
    async (request, response) => {
        let db = database.getDB()

        const updateObject = {
            $set: {
                isRead: true
            }
        }
        
        let data = await db.collection("request").updateOne(
            {userId: request.params.id}, updateObject
        )
        
        response.json(data)
        
    }
)


module.exports = requestRoute
