
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ credentials: true, origin: true }))

async function start () {
  const files = await require('./s3_import')()
  app.use('/', express.static('public'))
  app.get('/api/files', function (req, res) {
    res.send(files)
  })

  app.listen(19712, () => {
    console.log('Listening on port 19712!')
  })
}

start()
