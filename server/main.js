
const express = require('express')
const cors = require('cors')
const app = express()
const regions = require('./config.json')
app.use(cors({ credentials: true, origin: true }))

async function start () {
  const files = await require('./s3_import')()
  app.get('/api/files/:region', function (req, res) {
    res.send(files[req.params.region])
  })

  app.get('/api/regions', function (req, res) {
    const response = {}
    Object.keys(regions).forEach(region => { response[region] = { public: regions[region].s3Options.Bucket } })
    res.send(response)
  })

  app.listen(19712, () => {
    console.log('Listening on port 19712!')
  })
}

start()
