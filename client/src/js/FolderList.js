import React from 'React'
import '../css/Search.css'
import '../css/Folder.css'

export default class FolderList extends React.Component {
  state={ searchResult: [], searchQuery: '' }

  handleSearch = (ev) => {
    ev.persist()
    this.setState({
      searchResult: this.props.folders.filter(folder => folder.includes(ev.target.value.toUpperCase())),
      searchQuery: ev.target.value
    })
  }

  handleRegion = (ev) => {
    ev.persist()
    this.props.updateState({
      region: ev.target.value
    })
  }

  render () {
    return (
      <div
        className='col-md-4'
      >
        <div className='search'>
          <input type='text' className='searchTerm' placeholder='What are you looking for?' onChange={this.handleSearch} />
        </div>

        <span className='custom-dropdown'>
          <select onChange={this.handleRegion}>
            {Object.keys(this.props.regions).map(region => <option value={region} key={region}>{region}</option>)}
          </select>
        </span>
        <div
          className='ibox float-e-margins' style={{
            maxHeight: '85vh',
            overflowY: 'scroll',
            overflowX: 'hidden'
          }}
        >
          <div className='ibox-content'>
            <div className='file-manager'>
              <ul className='folder-list' style={{ padding: 0 }}>
                {this.state.searchQuery !== ''
                  ? this.state.searchResult.map(folder => <Folder key={folder} name={folder} updateState={this.props.updateState} />)
                  : this.props.folders.map(folder => <Folder key={folder} name={folder} updateState={this.props.updateState} />)}
              </ul>
              <div className='clearfix' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Folder extends React.Component {
  render () {
    return (
      <li onClick={() => this.props.updateState({ current: this.props.name })}><a><i className='fa fa-folder' />{this.props.name}</a></li>
    )
  }
}
