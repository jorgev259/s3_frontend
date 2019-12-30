var s3 = require('s3-client')
const regions = require('./config.json')
const writeJsonFile = require('write-json-file')
const clients = {}

Object.keys(regions).forEach(region => {
  clients[region] = s3.createClient({
    s3Options: regions[region].s3Options
  })
})

module.exports = () => {
  return new Promise((resolve, reject) => {
    const files = {}
    const promises = Object.keys(regions).map(region => handleRegion(region, files))
    Promise.all(promises)
      .then(() => {
        writeJsonFile('files.json', files)
          .then(() => {
            resolve(files)
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

function handleRegion (region, files) {
  return new Promise((resolve, reject) => {
    const client = clients[region]
    client.listObjects({ recursive: false, s3Params: { Bucket: regions[region].s3Options.Bucket } })
      .on('data', async data => {
        data.Contents.forEach(file => {
          const path = file.Key.split('/')
          if (path.length === 1) return

          const folder = path.shift()
          if (!files[region]) files[region] = {}
          if (!files[region][folder]) files[region][folder] = []
          files[region][folder].push(path.join('/'))
        })
      })
      .on('end', resolve)
      .on('err', reject)
  })
}
