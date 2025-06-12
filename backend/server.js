// Database + middleware 
const connect = require("./connect")
const express = require("express")
const cors = require("cors")

//Routes 
const appointment = require("./routes/appointRoute")
const document = require("./routes/docRoute")
const meeting = require("./routes/meetingRoute")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use(appointment)
app.use(document)
app.use(meeting)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log("Server is running")
})