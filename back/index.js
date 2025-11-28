require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

app.use(cors())

app.get('/search', async (req, res) => {
  const nasaClient = axios.create({
    baseURL: 'https://images-api.nasa.gov',
    headers: {
      Authorization: process.env.NASA_API_KEY
    }
  })

  const q = req.query.q
  const year = req.query.year

  const params = { q }

  if (year) {
    params.year_start = year
    params.year_end = year
  }

  const result = await nasaClient.get('/search', { params })

  res.json({ photos: result.data.collection.items })
})

app.get('/apod', async (req, res) => {
  const result = await axios.get(
    'https://api.nasa.gov/planetary/apod',
    {
      params: {
        api_key: process.env.NASA_API_KEY
      }
    }
  )

  res.json({
    date: result.data.date,
    title: result.data.title,
    explanation: result.data.explanation,
    url: result.data.url
  })
})

const port = 3000
app.listen(port, () => console.log(`Back. Porta ${port}.`))