import React from 'React'
import '../css/File.css'

export default class FileList extends React.Component {
  render () {
    return (
      <div className='col-md-8 animated fadeInRight'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='file-box'>
              {this.props.files.map(file => <File folder={this.props.folder} key={file} filename={file} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class File extends React.Component {
  render () {
    return (
      <div className='file'>
        <a href={`https://helix.squid-proxy.xyz/${this.props.folder}/${this.props.filename}`} download>
          <span className='corner' />
          <div className='file-name' style={{ wordWrap: 'break-word' }}>
            {this.props.filename}
          </div>
        </a>
      </div>
    )
  }
}

/* </div> <div className="file-box">
              <div className="file">
                <a href="#">
                  <span className="corner"></span>

                  <div className="image">
                    <img alt="image" className="img-responsive" src="http://lorempixel.com/400/300/nature/1">
                  </div>
                  <div className="file-name">
                    Italy street.jpg
                    <br>
                    <small>Added: Jan 6, 2014</small>
                  </div>
                </a>

              </div>
            </div> */
