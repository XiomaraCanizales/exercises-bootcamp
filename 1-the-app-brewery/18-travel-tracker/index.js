import express from 'express'
import bodyParser from 'body-parser'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3000

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// define new client
const db = new pg.Client({
    user: process.env.user,
    host: 'localhost',
    database: 'world',
    password: process.env.password,
    port: 5432,
})
db.connect()

async function getVisitedCountries() {
    const result = await db.query('SELECT country_code FROM visited_countries')
    let countries = []
    result.rows.forEach((country) => {
        countries.push(country.country_code)
    })
    return countries
}

// GET home page
app.get('/', async (req, res) => {
    const countries = await getVisitedCountries()
    res.status(200).render('index.ejs', { countries: countries, total: countries.length, error: null })
})

// POST add country
app.post('/add', async (req, res) => {
    // user's input
    const country = req.body.country.trim().toLowerCase()
    try {
        // search for country code
        const result = await db.query("SELECT country_code FROM countries WHERE LOWER (country_name) LIKE '%' || $1 || '%' " , [country])

        // if country is not found
        if (result.rows.length === 0) {
            console.log("Country not found", country)
            return res.status(404).render('index.ejs', { 
                countries: countries, 
                total: countries.length,
                error: 'Country not found. Please check the spelling and try again.' 
            })
        }

        // if country is found
        const country_code = result.rows[0].country_code
        console.log('Country code found:', country_code)

        // insert country code into visited_countries
        try {
            await db.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [country_code])
            res.status(201).redirect('/')

        } catch (err) {
            console.error('Error adding country:', err)
            const countries = await getVisitedCountries()
            res.render('index.ejs', {
                countries: countries,
                total: countries.length,
                error: 'Country has already been added, try again.'
            })
        } 

    } catch (err) {
      console.error('Query error:', err)
      const countries = await getVisitedCountries()
      res.status(500).render('index.ejs', {
          countries: countries,
          total: countries.length,
          error: 'Country name does not exist, try again.'
      })
    }
})

// open port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})