const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let meetingRoute = express.Router()

// Find All 
meetingRoute.route("/meeting").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("meeting").find({}).toArray()
        if (data.length >0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Find One 
meetingRoute.route("/meeting/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("meeting").findOne({_id: new ObjectId(request.params.id)})
        if (Object.keys(data).length > 0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Create One 
meetingRoute.route("/meeting").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            staff: request.body.staff,
            patient: request.body.patient,
            reason: request.body.reason, 
            date: request.body.date,
            time: request.body.time
        }
        let data = await db.collection("meeting").insertOne(mongoObject)
        response.json(data)
    }
)

// Edit One 
meetingRoute.route("/meeting/:id").put(
    async (request,response) => {
        let db = database.getDB()
        let mongoObject = {
            $set: {
                staff: request.body.staff,
                patient: request.body.patient,
                reason: request.body.reason, 
                date: request.body.date,
                time: request.body.time
            }
        }
        let data = await db.collection("meeting").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        response.json(data)
    }
)

// Delete One 
meetingRoute.route("/meeting").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("meeting").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = meetingRoute