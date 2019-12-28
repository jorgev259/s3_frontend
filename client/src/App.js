import React from 'react'
import './css/App.css'

import FileList from './js/FileList'
import FolderList from './js/FolderList'

import { get } from 'axios'

export default class App extends React.Component {
  state = { s3Files: {}, current: '' }

  updateCurrent (current) {
    this.setState({ current: current })
  }

  componentDidMount () {
    const context = this
    get('api/files').then(res => context.setState({ s3Files: res.data }))
  }

  render () {
    return (
      <>
        <FolderList folders={Object.keys(this.state.s3Files)} updateCurrent={this.updateCurrent.bind(this)} />
        <FileList folder={this.state.current} files={this.state.s3Files[this.state.current] || []} />
      </>
    )
  }
}
