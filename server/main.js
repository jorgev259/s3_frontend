
const express = require('express')
const s3 = require('s3-client')

const cors = require('cors')
const app = express()
app.use(cors({ credentials: true, origin: true }))

const db = require('better-sqlite3-helper')
db({
  path: './sqlite3.db',
  migrate: false
})

db().prepare(`CREATE TABLE IF NOT EXISTS "files" (
"file" TEXT NOT NULL,
"region" TEXT NOT NULL,
PRIMARY KEY("file","region")
)`).run()

const clients = {}
const regions = require('./config.json')
const message = require('./message.js')

Object.keys(regions).forEach(region => {
  clients[region] = s3.createClient({
    s3Options: regions[region].s3Options
  })
})

Object.keys(regions).forEach(region => {
  const client = clients[region]
  client.listObjects({ recursive: false, s3Params: { Bucket: regions[region].s3Options.Bucket } })
    .on('data', data => {
      data.Contents.forEach(file => {
        db().replace('files', { file: file.Key, region: region })
      })
    })
})

app.get('/api/files/:region', function (req, res) {
  res.send(db().prepare('SELECT file FROM files WHERE region = ?').all(req.params.region))
})

app.get('/api/message', function (req, res) {
  res.send(message)
})

app.get('/api/regions', function (req, res) {
  const response = {}
  Object.keys(regions).forEach(region => { response[region] = { public: regions[region].s3Options.Bucket } })
  res.send(response)
})

app.listen(19712, () => {
  console.log('Listening on port 19712!')
})
