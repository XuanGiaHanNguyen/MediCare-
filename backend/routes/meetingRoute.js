const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let meetingRoute = express.Router()

// Find All 
meetingRoute.route("/meeting").get(
    async (request, response) => {
        try {
            let db = database.getDB()
            let data = await db.collection("meeting").find({}).toArray()
            response.json(data) // Always return array, even if empty
        } catch (error) {
            console.error("Error fetching all meetings:", error);
            response.status(500).json({ error: "Server error", data: [] });
        }
    }
)

// Find One 
meetingRoute.route("/meeting/:id").get(
    async (request, response) => {
        let db = database.getDB();
        const userId = request.params.id;

        try {
            let data = await db.collection("meeting").find({
                $or: [
                    { userId: userId },
                    { participants: { $elemMatch: { userId: userId }}  }
                ]
            }).toArray();

            // Always return data, even if empty array
            response.json(data);
            
        } catch (error) {
            console.error("Error fetching meetings:", error);
            response.status(500).json({ error: "Server error", data: [] });
        }
    }
);

// Create One 
meetingRoute.route("/meeting").post(
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
            let data = await db.collection("meeting").insertOne(mongoObject)
            response.json(data)
        } catch (error) {
            console.error("Error creating meeting:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

// Approve one meeting 
meetingRoute.route("/meeting/:id").put(
    async (request, response) => {
        try {
            let db = database.getDB()
            let mongoObject = {
                $set: {
                    approved: true, 
                }
            }
            let data = await db.collection("meeting").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
            response.json(data)
        } catch (error) {
            console.error("Error updating meeting:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

// Approve a meeting (after approval, send it off to google calendar)


// Delete One - Fixed route path
meetingRoute.route("/meeting/:id").delete(
    async (request, response) => {
        try {
            let db = database.getDB()
            let data = await db.collection("meeting").deleteOne({_id: new ObjectId(request.params.id)})
            response.json(data)
        } catch (error) {
            console.error("Error deleting meeting:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
)

module.exports = meetingRoute