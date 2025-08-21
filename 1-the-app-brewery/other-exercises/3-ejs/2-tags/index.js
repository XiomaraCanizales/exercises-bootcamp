import express from 'express'
const app = express()

// routes
app.get('/', (req, res) => {
    const data = {
        title: "EJS tags",
        seconds: new Date().getSeconds(),
        items: ["apple", "banana", "cherry"],
        htmlContent: "<strong>This is some strong text</strong>"
    }
  res.render("index.ejs", { data })
})

// port
const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})