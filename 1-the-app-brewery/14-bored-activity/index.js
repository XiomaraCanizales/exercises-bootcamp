import express from "express"
import bodyParser from "body-parser"
import axios from 'axios'

// app & port
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

const url = "https://bored-api.appbrewery.com"

// routes
app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://bored-api.appbrewery.com/random")
        const result = response.data
        res.render("index.ejs", { data: result })
    } catch (error) {
        console.error("Failed to make request:", error.message)
        res.render("index.ejs", {
            error: error.message
        })
    }
})

app.post("/", async (req, res) => {
    try {
        // user input
        const type = req.body.type
        const participants = req.body.participants
        // make API request by user's input
        const response = await axios.get(
            `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
        )
        // get data from response
        const result = response.data

        // Select a random activity from the filtered results
        res.render("index.ejs", {
            data: result[Math.floor(Math.random() * result.length)]
        })
    // error handling
    } catch (error) {
        console.error("Failed to make request:", error.message)
        res.render("index.ejs", {
            error: "No activities match your criteria."
        })
    }
})

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
