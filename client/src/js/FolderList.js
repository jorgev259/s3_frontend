import React from 'react'
import '../css/Search.css'
import '../css/Folder.css'

export default class FolderList extends React.Component {
  state={ searchResult: [], searchQuery: '' }

  render () {
    return (
      <div className='col-md-12'>
        <div className='ibox float-e-margins'>
          <div className='ibox-content'>
            <div className='file-manager'>
              <ul className='folder-list' style={{ padding: 0 }}>
                {this.props.folders.map(({ children, name }, i) => (
                  children.length > 0
                    ? <Folder key={i} name={name} children={children} depth={0} path={['https:/', this.props.regions[this.props.region] ? this.props.regions[this.props.region].public : '', name]} />
                    : <li><a href={['https:/', this.props.regions[this.props.region] ? this.props.regions[this.props.region].public : '', name].join('/')} download><i className='fa fa-file' />{name}</a></li>
                ))}
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
  state = { open: false }
  render () {
    return (
      <>
        <li style={{ marginLeft: `${10 * this.props.depth}px` }} onClick={() => this.setState({ open: !this.state.open })}><a><i className={`fa fa-folder${this.state.open ? '-open' : ''}`} />{this.props.name}</a></li>
        {this.state.open ? this.props.children.map(({ children, name }, i) => (
          children.length > 0
            ? <Folder depth={this.props.depth + 1} key={i} name={name} children={children} path={[...this.props.path, name]} />
            : <li style={{ marginLeft: `${10 * (this.props.depth + 1)}px` }}><a href={[...this.props.path, name].join('/')} download><i className='fa fa-file' />{name}</a></li>
        )) : null}
      </>
    )
  }
}
