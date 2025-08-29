import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'   

const app = express()
const port = 3000
const API_URL = 'http://localhost:4000'

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`)
    res.render("index.ejs", { posts: response.data })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).send("Internal Server Error")
  }
})

// route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", {
    heading: "New Post",
    submit: "Create Post"
  })
})

app.get("/edit/:id", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${req.params.id}`) 
      res.render("modify.ejs", {
        heading: "Edit Post",
        submit: "Update Post",
        post: response.data
      })
    } catch (error) {
      console.error("Error fetching post:", error)
      res.status(500).send("Internal Server Error")
    }
})

// create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body)
    res.redirect("/")
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).send("Internal Server Error")
  }
})

// partially update a post
app.post("/api/posts/:id", async (req, res) => {
  try {
    const response = await axios.patch(
        `${API_URL}/posts/${req.params.id}`,
        req.body
    )
    res.redirect("/")
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).send("Internal Server Error")
  }
})

// delete post
app.get("/api/posts/:id/delete", async (req, res) => {
  try {
    await axios.delete(
        `${API_URL}/posts/${req.params.id}`
    )
    res.redirect("/")
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).send("Internal Server Error")
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
