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
  const result = await nasaClient.get('/search', {
    params: {
      q: req.query.q
    }
  })

  res.json({photos: result.data.collection.items})
})

const port = 3000
app.listen(port, () => console.log(`Back. Porta ${port}.`))