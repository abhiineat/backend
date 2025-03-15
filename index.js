const express = require('express')
const app = express()

require('dotenv').config()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about', (req, res) => {
  res.send('About us')
})
app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})