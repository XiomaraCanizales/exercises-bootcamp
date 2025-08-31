import express from 'express'
import bodyParser from 'body-parser'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3000

// middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// game variables
let totalCorrect = 0
let currentQuestion = {}

let quiz = [
   /*  { country: 'France', capital: 'Paris' },
    { country: 'Germany', capital: 'Berlin' },
    { country: 'Italy', capital: 'Rome' },
    { country: 'Spain', capital: 'Madrid' },
    { country: 'Portugal', capital: 'Lisbon' } */
]

// define new client
const db = new pg.Client({
    user: process.env.user,
    host: 'localhost',
    database: 'world',
    password: process.env.password,
    port: 5432,
})

db.connect()

// connect db
db.query('SELECT *  FROM capitals', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack)
    } else {
        console.log('Database connected')
        quiz = res.rows
    }
    db.end()
})

// get HOME
app.get('/', async (req, res) => {
    totalCorrect = 0
    await nextQuestion()
    console.log(currentQuestion)
    res.render('index.ejs', { question: currentQuestion })
})

// POST answer
app.post('/submit', async (req, res) => {
    let answer = req.body.answer.trim()
    let isCorrect = false
    if (answer.toLowerCase() === currentQuestion.capital.toLowerCase()) {
        totalCorrect++
        console.log(totalCorrect)
        isCorrect = true
    }
    await nextQuestion()
    res.render('index.ejs', { 
        question: currentQuestion,
        totalScore: totalCorrect,
        wasCorrect: isCorrect
    })
})

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)]
    currentQuestion = randomCountry
}

// port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
