const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let appointRoute = express.Router()

// Find All
appointRoute.route("/appointment").get(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("appointment").find({}).toArray()
    }
)