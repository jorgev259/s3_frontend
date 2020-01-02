import React from 'react'
import ping from 'web-ping'
import './css/App.css'

import FileList from './js/FileList'
import FolderList from './js/FolderList'

import { get } from 'axios'

export default class App extends React.Component {
  state = { s3Files: {}, current: '', region: '', regions: [] }

  updateState (current) {
    this.setState(current)
  }

  componentDidMount () {
    const context = this
    get('api/regions').then(res => {
      const promises = Object.keys(res.data).map(region => {
        return new Promise((resolve, reject) => {
          ping(res.data[region].endpoint).then(function (delta) {
            resolve({ region: region, ms: delta, public: res.data[region].public })
          }).catch(function (err) {
            console.error('Could not ping remote URL', err)
            resolve({ region: region, ms: 9999999 })
          })
        })
      })

      Promise.all(promises).then(result => {
        const sorted = result.sort((a, b) => (a.ms > b.ms) ? 1 : -1)
        context.setState({ regions: sorted, region: sorted[0].region })
      })
    })
  }

  componentDidUpdate () {
    const context = this
    get(`api/files/${this.state.region}`).then(res => context.setState({ s3Files: res.data }))
  }

  render () {
    return (
      <>
        <FolderList regions={this.state.regions} folders={Object.keys(this.state.s3Files)} updateState={this.updateState.bind(this)} />
        <FileList region={this.state.regions.find(e => e.region === this.state.region)} folder={this.state.current} files={this.state.s3Files[this.state.current] || []} />
      </>
    )
  }
}
