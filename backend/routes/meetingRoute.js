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

// Find One for Staff
meetingRoute.route("/meeting/:id").get(
    async (request, response) => {
        let db = database.getDB();
        const userId = request.params.id;

        try {
            let data = await db.collection("meeting").find({
                $or: [
                    { userId: userId },
                    { "participants": { $elemMatch: { $eq: userId } } }
                ]
            }).toArray();

            if (data.length > 0) {
                response.json(data);
            } else {
                response.status(404).json({ error: "No meetings found." });
            }
        } catch (error) {
            console.error("Error fetching meetings:", error);
            response.status(500).json({ error: "Server error" });
        }
    }
);


// Create One 
meetingRoute.route("/meeting").post(
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