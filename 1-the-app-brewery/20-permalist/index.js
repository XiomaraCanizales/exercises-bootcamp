import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = 3000

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// define new client
const db = new pg.Client({
    user: process.env.user,
    host: 'localhost',
    database: 'permalist',
    password: process.env.password,
    port: 5432
})
db.connect()

// GET /home and show todo list
app.get("/", async (req, res) => {
    const data = await db.query('SELECT * FROM items ORDER BY id')
    
    res.render("index.ejs", {
        listItems: data.rows,
        listTitle: "Today"
    })
})

// POST /add todo list
app.post("/add", async (req, res) => {
    const userInput = req.body.newItem
    await db.query('INSERT INTO items (title) VALUES ($1)', [userInput])
    return res.status(201).redirect("/")
})

// PUT /edit todo list
app.post("/edit", async (req, res) => {
    const id = req.body.updatedItemId
    const title = req.body.updatedItemTitle
    try {
        await db.query('UPDATE items SET title = $1 WHERE id = $2 RETURNING *', [title, id])
        return res.redirect("/")
    } catch (err) {
        console.log("Query error: ", err)
        return res.redirect("/")
    }
    
})

// DELETE /delete todo list
app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId
    try {
        await db.query('DELETE FROM items WHERE id = $1', [id])
        return res.redirect("/")
    } catch (error) {
        console.log("Query error: ", err)
        return res.redirect("/")
    }
})

// port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
