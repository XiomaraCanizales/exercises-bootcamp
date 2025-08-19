import express from 'express'
import bodyParser from 'body-parser'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = 3000
const password = "ILoveProgramming"

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post('/check', (req, res) => {
    if (req.body.password === password) {
        res.sendFile(__dirname + "/public/secrets.html")
    } else {
        res.send(`
            <h1>You entered the wrong password.</h1>
            <a href='/'>Try again</a>`)
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})