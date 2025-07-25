const database = require("../connect")
const express = require("express")
const ObjectId = require("mongodb").ObjectId
const bcrypt = require("bcrypt")

const userRoute = express.Router()
const SALT_ROUNDS = 6

// Get All
userRoute.route("/user").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user").find({}).toArray()
        if (data.length > 0){
            response.json(data)
        } else {
            throw new Error ("Data not found.")
        }
    }
)

// Get One 
userRoute.route("/user/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user").findOne({_id: new ObjectId(request.params.id)})
        if ( Object.keys(data).length > 0 ){
            response.json(data)
        } else {
            throw new Error ("Data not found")
        }
    }
)

// Create One 
userRoute.route("/user").post(
    async (request, response) => {
        let db = database.getDB()
        let taken = await db.collection("user").findOne({email: request.body.email})
        if (taken){
            response.json({success: false, message: "email taken"})
        } else {
            let hash = await bcrypt.hash(request.body.password, SALT_ROUNDS )
            let mongoObject = {
                is_staff: request.body.is_staff, 
                full_name: request.body.full_name, 
                email: request.body.email,
                password: hash, 
                google: request.body.google
            }
            let data = await db.collection("user").insertOne(mongoObject)
            response.json(data)
        }
    }
)

// Edit One 
userRoute.route("/user/:id").put(
    async (request, response) => {
        let db = database.getDB()
        let hash = bcrypt.hash(request.body.password, SALT_ROUNDS)
        let mongoObject = {
            $set: {
                is_staff: request.body.is_staff, 
                full_name: request.body.full_name, 
                email: request.body.email,
                password: hash, 
                google: request.body.google
            }
        }
        let data = await db.collection("user").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
        response.json(data)
    }
)

// Delete One 
userRoute.route("/user").delete(
    async (request, response) => {
        let db = database.getDB
        let data = await db.collection("user").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

// Login 
userRoute.route("/user/login").post(
    async (request, response) => {
        let db = database.getDB()
        let user = await db.collection("user").findOne({email: request.body.email})

        if (user){
            
            let confirmation = await bcrypt.compare(request.body.password, user.password)
            if (confirmation) {
                response.json({success: true, user})
            } else {
                response.json({success: false, message: "Error"})
            }

        } else {
            response.json({success: false, message: "Error"})
        }
    }
)

// Export Route 
module.exports = userRoute