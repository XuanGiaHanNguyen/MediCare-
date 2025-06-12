const connect = require("./connect")
const express = require("express")
const cors = require("cors")

//Routes 
const appointment = require("./routes/appointRoute")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use(appointment)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log("Server is running")
})