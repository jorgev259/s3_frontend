import React from 'react'
import './css/App.css'

import FolderList from './js/FolderList'

import { get } from 'axios'

export default class App extends React.Component {
  state = { s3Files: [], current: '', region: '', regions: {}, message: 'Custom message not retrieved' }

  componentDidMount () {
    get('api/regions').then(res => this.setState({ regions: res.data, region: Object.keys(res.data)[0] }))
    get('api/message').then(res => this.setState({ message: res.data }))
  }

  handlePathList (parent, list) {
    if (list.length > 1) {
      return parent[list.shift()]
    }
  }

  componentDidUpdate () {
    get(`api/files/${this.state.region}`).then(res => {
      const paths = res.data
      const result = []
      const level = { result }

      paths.forEach(({ file }) => {
        file.split('/').reduce((r, name, i, a) => {
          if (!r[name]) {
            r[name] = { result: [] }
            r.result.push({ name, children: r[name].result })
          }

          return r[name]
        }, level)
      })

      this.setState({ s3Files: result })
    })
  }

  handleSearch = (ev) => {
    ev.persist()
    this.setState({
      searchResult: this.props.folders.filter(folder => folder.includes(ev.target.value.toUpperCase())),
      searchQuery: ev.target.value
    })
  }

  handleRegion = (ev) => {
    ev.persist()
    this.setState({
      region: ev.target.value
    })
  }

  render () {
    return (
      <>
        <div className='sticky-top'>
          <div class='row' style={{ height: '40px' }}>
            <div class='col-md-12'>
              <div className='search'>
                <input type='text' className='searchTerm' placeholder='What are you looking for?' onChange={this.handleSearch} />
              </div>
            </div>
          </div>
          <div class='row' style={{ height: '60px' }}>
            <div class='col-md-12'>
              <span className='custom-dropdown'>
                <select onChange={this.handleRegion}>
                  {Object.keys(this.state.regions).map(region => <option value={region} key={region}>{region}</option>)}
                </select>
              </span>
            </div>
          </div>
          <div class='row' style={{ height: '40px' }}>
            <div class='col-md-12'>
              <span>
                {this.state.message}
              </span>
            </div>
          </div>
        </div>

        <div class='row'>
          <FolderList regions={this.state.regions} region={this.state.region} folders={this.state.s3Files} />
        </div>
      </>
    )
  }
}
