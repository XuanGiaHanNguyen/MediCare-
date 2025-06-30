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

// Find appointment 
appointRoute.route("/appointment/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("appointment").find({
                $or: [
                    { userId: request.params.id },
                    { participants: { $elemMatch: { userId: request.params.id }}  }
                ]
            }).toArray();
        if (Object.keys(data).length > 0 ){
            response.json(data)
        }
    }
)

// Create One 
appointRoute.route("/appointment").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            approved: request.body.approved, 
            color: request.body.color, 
            createdAt: request.body.createdAt, 
            date: request.body.date, 
            description: request.body.description, 
            duration: request.body.duration,
            location: request.body.location, 
            participants: request.body.participants, 
            session: request.body.session, 
            time: request.body.time, 
            title: request.body.title, 
            userId: request.body.userId
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
               approved: request.body.approved, 
                color: request.body.color, 
                createdAt: request.body.createdAt, 
                date: request.body.date, 
                description: request.body.description, 
                duration: request.body.duration,
                location: request.body.location, 
                participants: request.body.participants, 
                session: request.body.session, 
                time: request.body.time, 
                title: request.body.title, 
                userId: request.body.userId
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