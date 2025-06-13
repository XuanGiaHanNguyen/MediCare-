const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let staffRoute = express.Router()

// Get All
staffRoute.route("/staff").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_staff").find({}).toArray()
        if (data.length > 0){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)
// Get One
staffRoute.route("/staff/:id").get(
    async (request, response ) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_staff").findOne({_id: new ObjectId(request.params.id)})
        if (Object.keys(data).length > 0){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Create One
staffRoute.route("/staff").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            language: request.body.language,
            tele_avail: request.body.tele_avail, 
            bio: request.body.bio, 
            role: request.body.role, 
            patient: request.body.patient
        }
        let data = await db.collection("user_profile_staff").insertOne(mongoObject)
        response.json(data)
    }
)

// Edit One
staffRoute.route("/staff/:id").put(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            $set: {
                language: request.body.language,
                tele_avail: request.body.tele_avail, 
                bio: request.body.bio, 
                role: request.body.role, 
                patient: request.body.patient
            }
        }
        let data = await db.collection("user_profile_staff").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        response.json(data)
    }
)


// Delete One 
staffRoute.route("/staff/:id").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_staff").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = staffRoute