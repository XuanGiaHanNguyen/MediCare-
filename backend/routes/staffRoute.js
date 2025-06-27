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
        let data = await db.collection("user_profile_staff").findOne({userId:request.params.id})
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
        let db = database.getDB();

        // Define all expected fields
        const expectedFields = ["userId","language", "tele_avail", "bio", "role", "patient", "education", "year", "experience", "phone", "name"];

        // Build the object with null for any missing fields
        let mongoObject = {};
        for (let field of expectedFields) {
            if (field === "patient"){
                mongoObject[field] = request.body[field] !== undefined ? request.body[field] : [];
            }else {
                mongoObject[field] = request.body[field] !== undefined ? request.body[field] : null;
            }  
        }

        let data = await db.collection("user_profile_staff").insertOne(mongoObject);
        response.json(data);
    }
);

// Edit One 
staffRoute.route("/staff/:id").put(
    async (request, response) => {
        try {
            let db = database.getDB();
            
            // Log the incoming data for debugging
            console.log("Received data:", request.body);
            console.log("User ID:", request.params.id);

            // Define editable fields
            const editableFields = [
                "userId", "language", "tele_avail", "bio", "role", "patient", 
                "education", "year", "experience", "phone", "education", "experience", "name"
            ];

            // Separate update operators
            let updateObject = { $set: {}, $push: {} };

            for (let field of editableFields) {
            if (request.body[field] !== undefined) {
                if (field === "patient") {
                // If patient is an array, push each one individually using $each
                updateObject.$push[field] = {
                    $each: Array.isArray(request.body[field]) ? request.body[field] : [request.body[field]]
                };
                } else {
                updateObject.$set[field] = request.body[field];
                }
            }
            }

            // Clean up if $push or $set is empty to avoid errors
            if (Object.keys(updateObject.$push).length === 0) {
            delete updateObject.$push;
            }
            if (Object.keys(updateObject.$set).length === 0) {
            delete updateObject.$set;
            }

            // First, check if the document exists
            const existingDoc = await db.collection("user_profile_staff").findOne(
                { userId:request.params.id }
            );

            if (!existingDoc) {
                return response.status(404).json({ 
                    error: "User not found",
                    acknowledged: false,
                    matchedCount: 0
                });
            }

            console.log("Found existing document");

            // Update the document
            let data = await db.collection("user_profile_staff").updateOne(
                { userId:request.params.id },
                mongoObject
            );

            console.log("Update result:", data);

            // Verify the update by fetching the updated document
            const updatedDoc = await db.collection("user_profile_staff").findOne(
                { userId:request.params.id }
            );

            console.log("Updated document:", {
                bio: updatedDoc.bio,
                education: updatedDoc.education,
                experience: updatedDoc.experience
            });

            response.json({
                ...data,
                updatedData: {
                    bio: updatedDoc.bio,
                    education: updatedDoc.education,
                    experience: updatedDoc.experience
                }
            });

        } catch (error) {
            console.error("Error updating staff profile:", error);
            response.status(500).json({ 
                error: "Internal server error",
                message: error.message 
            });
        }
    }
);

// Delete One 
staffRoute.route("/staff/:id").delete(
    async (request, response) => {
        let db = database.getDB()
        let data = await db.collection("user_profile_staff").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data)
    }
)

module.exports = staffRoute