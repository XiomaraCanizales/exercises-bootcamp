import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get('/about', (req, res) => {
    res.send("<h1>I'm Xiomara Canizales</h1>")
})

app.get('/contact', (req, res) => {
    res.send("<p>mail contact: x.xiomara@gmail.com</p>")
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
