const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let docRoute = express.Router()

// Get All 
docRoute.route("/document").get(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("document").find({}).toArray()
        if (data.length >0){
            response.json(data)
        }else{
            throw new Error ("Data not found.")
        }
    }
)

// Get One
docRoute.route("/document/:id").get(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("document").findOne({_id: new ObjectId(request.params.id)})
        if (Object.keys(data).length >0){
            response.json(data)
        }else{
            throw new Error ("Data not found")
        }
    }
)

// Create One 
docRoute.route("/document").post(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            created_by: request.body.created_by,
            shared_to: request.body.shared_to,
            catagory: request.body.catagory, 
            type: request.body.type 
        }
        let data = db.collection("document").insertOne(mongoObject)
        response.json(data)
    }
)

// Edit One 
docRoute.route("/document").put(
    async (request, response) => {
        let db = database.getDB()
        let mongoObject = {
            $set: {
                created_by: request.body.created_by,
                shared_to: request.body.shared_to,
                catagory: request.body.catagory, 
                type: request.body.type 
            }
        }
        let data = db.collection("document").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        response.json(data)

    }
)

// Delete One
docRoute.route("/document").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = db.collection("document").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = docRoute