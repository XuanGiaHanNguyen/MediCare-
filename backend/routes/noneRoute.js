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
        let data = await db.collection("user_profile_none").findOne({_id: new ObjectId(request.params.id)})
        if (Object.keys(data).length > 0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Create One 
userNoneRoute.route("/patient").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            language: request.body.language, 
            tele_avail: request.body.tele_avail, 
            bio: request.body.bio, 
            diagnosis: request.body.diagnosis, 
            staff_in_charge: request.body.staff_in_charge, 
            status: request.body.status
        }
        let data = await db.collection("user_profile_none").insertOne(mongoObject)
        response.json(data)
    }
)

// Edit One 
userNoneRoute.route("/patient/:id").put(
    async (request,response) => {
        let db = database.getDB()
        let mongoObject = {
            $set: {
                language: request.body.language, 
                tele_avail: request.body.tele_avail, 
                bio: request.body.bio, 
                diagnosis: request.body.diagnosis, 
                staff_in_charge: request.body.staff_in_charge, 
                status: request.body.status
            }
        }
        let data = await db.collection("user_profile_none").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        response.json(data)
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