import React from 'react'
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
      const regions = Object.keys(res.data)
      context.setState({ regions: regions, region: regions[0].region })
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
