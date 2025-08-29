import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 4000

// in-memory data store
let posts = [
    { 
        id: 1, 
        title: "Post 1", 
        content: "Content for post 1", 
        author: "Author 1",
        date: "2023-01-01"
    },
    { 
        id: 2, 
        title: "Post 2", 
        content: "Content for post 2", 
        author: "Author 2", 
        date: "2023-01-02" 
    },
    { 
        id: 3, 
        title: "Post 3", 
        content: "Content for post 3", 
        author: "Author 3", 
        date: "2023-01-03" 
    }
]

let lastId = 3

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CHALLENGE
// 1. (GET) get all posts
app.get("/posts", (req, res) => {
    res.json(posts)
})

// 2. (GET) get a single post by id
app.get("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id))
    if (!post) return res.status(404).send("Post not found")
    res.json(post)
})

// 3. (POST) create a new post
app.post("/posts", (req, res) => {
    const { title, content, author, date } = req.body
    if (!title || !content || !author || !date) {
        return res.status(400).send("All fields are required")
    }
    const newPost = {
        id: ++lastId,
        title,
        content,
        author,
        date
    }
    posts.push(newPost)
    res.status(201).json(newPost)
})

// 4. (PATCH) patch a post when you just want to update one parameter
app.patch("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id))
    if (!post) return res.status(404).send("Post not found")

    const { title, content, author, date } = req.body
    if (title) post.title = title
    if (content) post.content = content
    if (author) post.author = author
    if (date) post.date = date

    res.json(post)
})

// 5. (DELETE) delete a specific post by providing the post id
app.delete("/posts/:id", (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id))
    if (postIndex === -1) return res.status(404).send("Post not found")

    posts.splice(postIndex, 1)
    res.status(204).send()
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})