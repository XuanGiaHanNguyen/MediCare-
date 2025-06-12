const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let appointRoute = express.Router()

// Find All
appointRoute.route("/appointment").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("appointment").find({}).toArray()
        if (data.length >0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Find One 
appointRoute.route("/appointment/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("appointment").findOne({_id: new ObjectId(request.params.id)})
        if (Object.keys(data).length > 0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Create One 
appointRoute.route("/appointment").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            staff: request.body.staff,
            patient: request.body.patient,
            reason: request.body.reason, 
            date: request.body.date,
            time: request.body.time
        }
        let data = await db.collection("appointment").insertOne(mongoObject)
        response.json(data)
    }
)

// Edit One 
appointRoute.route("/appointment/:id").put(
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
        let data = await db.collection("appointment").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        response.json(data)
    }
)

// Delete One 
appointRoute.route("/appointment").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("appointment").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = appointRoute