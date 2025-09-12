import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// hard code but use db later
let users = [
    { id: 1, name: "Alice", color: "lightblue" },  
    { id: 2, name: "Bob", color: "lightgreen" },
    { id: 3, name: "Charlie", color: "lightcoral" }
]
let currentUserId = 1

// define new client
const db = new pg.Client({
    user: process.env.user,
    host: 'localhost',
    database: 'world',
    password: process.env.password,
    port: 5432,
})
db.connect()

// function to fecth visited countries from db
async function checkVisited() {
    const result = await db.query(
        "SELECT country_code FROM visited_countries_users JOIN users ON users.id = visited_countries_users.user_id WHERE users.id = $1",
        [currentUserId]
    )
    let countries = []
    result.rows.forEach((country) => {
        countries.push(country.country_code)
    })
    return countries
}

// fetch country code
async function fetchCountry(country) {
    try {
        const result = await db.query(
            "SELECT country_code FROM countries WHERE LOWER (country_name) LIKE '%' || $1 || '%' ",
            [country]
        )
        return result.rows[0].country_code
    } catch (error) {
        console.error("Error fetching country: ", error)
        return null
    }
}

// fetch users
async function fetchUsers() {
    const result = await db.query("SELECT * FROM users")
    return result.rows
}

// fetch color of current user
async function fetchUserColor() {
    const result = await db.query("SELECT color FROM users WHERE id = $1", [currentUserId])
    return result.rows[0].color
}

// GET home page
app.get("/", async (req, res) => {
    const countries = await checkVisited()
    const users = await fetchUsers()
    const color = await fetchUserColor()
    res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: color
    })
})

// POST add country
app.post("/add", async (req, res) => {
    // user's input
    const country = req.body.country.trim().toLowerCase()

    try {
        // search for country code
        const result = await fetchCountry(country)

        // if country is not found
        if (!result) {
            console.log("Country not found", country)
            return res.redirect("/")
        }

        // if country is found
        const country_code = result

        // insert country code into visited_countries
        try {
            await db.query(
                "INSERT INTO visited_countries_users (country_code, user_id) VALUES ($1, $2)",
                [country_code, currentUserId]
            )
            res.status(201).redirect("/")
            
        } catch (err) {
            console.error("Error adding country:", err)
            return res.redirect("/")
        }


    } catch (err) {
        console.error('Query error:', err)
        res.redirect("/")
    }

})

// POST change user
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs")
  } else {
    currentUserId = req.body.user
    res.redirect("/")
  }
})


// new user
app.post("/new", async (req, res) => {
  const name = req.body.name
  const color = req.body.color

  const result = await db.query(
    "INSERT INTO users (username, color) VALUES($1, $2) RETURNING *;",
    [name, color]
  );

  const id = result.rows[0].id;
  currentUserId = id

  res.redirect("/")
})

// port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})