import React from 'react'
import urljoin from 'url-join'
import '../css/Search.css'
import '../css/Folder.css'

export default class FolderList extends React.Component {
  render () {
    const items = this.props.folders.map((item, i) => (
      item.children.length > 0
        ? <Folder key={i} search={this.props.search} {...item} depth={0} path={[this.props.public, item.name]} />
        : <li><a href={urljoin('https://', this.props.public, item.name)} download><i className='fa fa-file' />{item.name}</a></li>

    ))

    return (
      <div className='file-manager'>
        <ul className='folder-list' style={{ padding: 0 }}>
          {items}
        </ul>
        <div className='clearfix' />
      </div>
    )
  }
}

class Folder extends React.Component {
  state = { open: false }
  render () {
    var items = this.props.children.map((item, i) => (
      item.children.length > 0
        ? <Folder key={i} search={this.props.search} {...item} depth={this.props.depth + 1} path={[...this.props.path, this.props.name, item.name]} />
        : <li key={i} style={{ marginLeft: `${10 * (this.props.depth + 1)}px` }}><a href={urljoin('https://', ...this.props.path, item.name)} download><i className='fa fa-file' />{item.name}</a></li>

    ))

    return items.length > 0 ? (
      <>
        <li style={{ marginLeft: `${10 * this.props.depth}px` }} onClick={() => this.setState({ open: !this.state.open })}><a><i className={`fa fa-folder${this.state.open ? '-open' : ''}`} />{this.props.name}</a></li>
        {this.state.open ? items : null}
      </>
    ) : null
  }
}
