import express from 'express'
const app = express()

// custom middleware
let advice = ""
const getDay = (req, res, next) => {
    const currentDay = new Date()
    let day = currentDay.getDay()
    if (day === 0 || day === 6) {
        advice = "Hey! It's a weekend, it's time to have fun!"
    } else {
        advice = "Hey! It's a weekday, it's time to work hard!"
    }
    next()
}
app.use(getDay)

// routes
app.get('/', (req, res) => {
  res.render("../views/index.ejs", { advice })
})

// port
const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})  