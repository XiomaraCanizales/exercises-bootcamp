import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.post('/register', (req, res) => {{
    res.sendStatus(201)
}})

app.put('/user/xiomara', (req, res) => {{
    res.sendStatus(200)
}})

app.patch('/user/xiomara', (req, res) => {{
    res.sendStatus(200)
}})

app.delete('/user/xiomara', (req, res) => {{
    res.sendStatus(200)
}})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})