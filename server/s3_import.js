var s3 = require('s3-client')
const { s3Options, bucket } = require('./config.json')
const writeJsonFile = require('write-json-file')

var client = s3.createClient({
  s3Options: s3Options
})

module.exports = () => {
  return new Promise((resolve, reject) => {
    const files = {}
    client.listObjects({ recursive: false, s3Params: { Bucket: bucket } })
      .on('data', async data => {
        data.Contents.forEach(file => {
          const path = file.Key.split('/')
          if (path.length === 1) return

          const folder = path.shift()

          if (!files[folder]) files[folder] = []
          files[folder].push(path.join('/'))
        })
      })
      .on('end', () => {
        writeJsonFile('files.json', files)
          .then(() => {
            resolve(files)
          })
          .catch(reject)
      })
      .on('err', reject)
  })
}
