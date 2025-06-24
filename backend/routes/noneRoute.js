const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let userNoneRoute = express.Router()

// Find All 
userNoneRoute.route("/patient").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_none").find({}).toArray()
        if (data.length >0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Find One 
userNoneRoute.route("/patient/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_none").findOne({userId: request.params.id})
        if (data) {
            response.json(data)
        } else {
            response.status(404).json({ error: "Data not found." })
        }
    }
)

// Create One 
userNoneRoute.route("/patient").post(
    async (request, response) => {
        let db = database.getDB();

        // List of all expected fields
        const expectedFields = ["userId","language", "tele_avail", "bio", "diagnosis", "staff_in_charge", "status", "phone", "age"];

        // Create mongoObject with null as default
        let mongoObject = {};
        for (let field of expectedFields) {
            mongoObject[field] = request.body[field] !== undefined ? request.body[field] : null;
        }

        let data = await db.collection("user_profile_none").insertOne(mongoObject);
        response.json(data);
    }
)

// Edit One 
userNoneRoute.route("/patient/:id").put(
    async (request,response) => {
       const { id, updates } = request.body;

        // Update only provided fields
        let result = await db.collection("user_profile_none").updateOne(
            { userId: id},
            { $set: updates }
        );

        response.json(result);
    }
)

// Delete One 
userNoneRoute.route("/patient").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("user_profile_none").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = userNoneRoute