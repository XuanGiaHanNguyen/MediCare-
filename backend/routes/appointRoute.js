const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let appointRoute = express.Router()

// Find All
appointRoute.route("/appointment").get(
    async (request, response) => {
        try {
            let db = database.getDB()
            let data = await db.collection("appointment").find({}).toArray()
            response.json(data) // Always return array, even if empty
        } catch (error) {
            console.error("Error fetching all appointments:", error);
            response.status(500).json({ error: "Server error", data: [] });
        }
    }
)

// Find appointment 
appointRoute.route("/appointment/:id").get(
    async (request, response) => {
        try {
            let db = database.getDB()
            let data = await db.collection("appointment").find({
                $or: [
                    { userId: request.params.id },
                    { participants: { $elemMatch: { userId: request.params.id }}  }
                ]
            }).toArray();
            
            // Always return data, even if empty array
            response.json(data);
            
        } catch (error) {
            console.error("Error fetching appointments:", error);
            response.status(500).json({ error: "Server error", data: [] });
        }
    }
)

// Create One 
appointRoute.route("/appointment").post(
    async (request, response) => {
        try {
            let db = database.getDB()
            let mongoObject = {
                approved: request.body.approved, 
                link: request.body.link, 
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
        } catch (error) {
            console.error("Error creating appointment:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

// Edit One 
appointRoute.route("/appointment/:id").put(
    async (request, response) => {
        try {
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
        } catch (error) {
            console.error("Error updating appointment:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

// Delete One - Fixed route path
appointRoute.route("/appointment/:id").delete(
    async (request, response) => {
        try {
            let db = database.getDB()
            let data = await db.collection("appointment").deleteOne({_id: new ObjectId(request.params.id)})
            response.json(data)
        } catch (error) {
            console.error("Error deleting appointment:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

module.exports = appointRoute