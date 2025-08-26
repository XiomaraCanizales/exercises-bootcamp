import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

// api url & token
const API_URL = "https://secrets-api.appbrewery.com"
const bearerToken = "cf227f5b-97ab-4413-a95a-6115e61d0340"
const config = {
  headers: { Authorization: `Bearer ${bearerToken}` },
}

// app setup
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//routes
// index
app.get("/", async (req, res) => {
    res.render("index.ejs", { secret: "" })
})

// get by id
app.post("/get-secret", async (req, res) => {
    const { id } = req.body
    try {
        const response = await axios.get(API_URL + "/secrets/" + id, config)
        res.render("index.ejs", { secret: response.data })
    } catch (error) {
        //console.error(error)
        res.status(500).send("Error retrieving secret")
    }
})

// add secret
app.post("/post-secret", async (req, res) => {
  const { secret } = req.body
  try {
    const response = await axios.post(
      API_URL + "/secrets",
      { secret: secret },
      config
    )
    res.render("index.ejs", { secret: response.data })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error adding secret")
  }
})

// after this, the code doesnt work, database is needed
// change secret
app.post("/put-secret", async (req, res) => {
  const { id } = req.body
  try {
    const response = await axios.put(
      API_URL + "/secrets/" + id,
      { secret: secret },
      config
    )
    res.render("index.ejs", { secret: response.data })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error changing secret")
  }
})

// update secret
app.post("/patch-secret", async (req, res) => {
  const { id } = req.body
  try {
    const response = await axios.patch(
      API_URL + "/secrets/" + id,
      { secret: secret },
      config
    )
    res.render("index.ejs", { secret: response.data })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error changing secret")
  }
})

// delete secret
app.post("/delete-secret", async (req, res) => {
  const { id } = req.body
  try {
    const response = await axios.delete(
      API_URL + "/secrets/" + id,
      config
    )
    res.render("index.ejs", { secret: response.data })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error deleting secret")
  }
})

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})