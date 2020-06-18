import React from 'react'
import './css/App.css'

import FolderList from './js/FolderList'

import { get } from 'axios'

export default class App extends React.Component {
  state = { paths: [], folders: [], region: '', regions: {}, message: 'Custom message not retrieved', search: '', loading: true }

  componentDidMount () {
    get('api/regions').then(res => this.setState({ regions: res.data, region: Object.keys(res.data)[0] }, this.refreshPaths))
    get('api/message').then(res => this.setState({ message: res.data }))
  }

  refreshFiles () {
    const result = []
    const level = { result }
    this.state.paths.filter(({ file }) => this.state.search === '' || file.toLowerCase().includes(this.state.search)).forEach(({ file }) => {
      file.split('/').reduce((r, name, i, a) => {
        if (!r[name] && name !== '') {
          r[name] = { result: [] }
          r.result.push({ name, children: r[name].result })
        }

        return r[name]
      }, level)
    })

    this.setState({ folders: result, loading: false })
  }

  refreshPaths () {
    this.setState({ loading: true }, () => {
      get(`api/files/${this.state.region}`).then(res => this.setState({ paths: res.data }, this.refreshFiles))
    })
  }

  handleSearch = (ev) => {
    ev.persist()
    if (this.typingTimer) clearTimeout(this.typingTimer)
    this.typingTimer = setTimeout(() => {
      this.setState({
        search: ev.target.value.toLowerCase()
      }, this.refreshFiles)
    }, 3 * 1000)
  }

  handleRegion = (ev) => {
    ev.persist()
    this.setState({
      region: ev.target.value
    }, this.refreshPaths)
  }

  render () {
    return (
      <>
        <div className='sticky-top'>
          <div className='row' style={{ height: '40px' }}>
            <div className='col-md-12'>
              <div className='search'>
                <input type='text' className='searchTerm' placeholder='What are you looking for?' onChange={this.handleSearch} />
              </div>
            </div>
          </div>
          <div className='row' style={{ height: '60px' }}>
            <div className='col-md-12'>
              <span className='custom-dropdown'>
                <select onChange={this.handleRegion}>
                  {Object.keys(this.state.regions).map(region => <option value={region} key={region}>{region}</option>)}
                </select>
              </span>
            </div>
          </div>
          <div className='row' style={{ height: '40px' }}>
            <div className='col-md-12'>
              <span>
                {this.state.message}
              </span>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='ibox float-e-margins'>
              <div className='ibox-content'>
                {this.state.loading ? (
                  <div className='spin mx-auto' style={{ height: '100px', width: '100px' }}>
                    <img alt='' src='/img/clouds.png' style={{ height: '100px', width: '100px' }} />
                  </div>
                ) : <FolderList {...this.state} {...this.state.regions[this.state.region]} />}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
