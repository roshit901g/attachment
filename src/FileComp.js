import React, { Component } from 'react'

export class FileComp extends Component {
    constructor(props) {
        super(props)

        this.onFileChange = this.onFileChange.bind(this);
    }

    onFileChange = (event) => {
        var handleToUpdate = this.props.handleToUpdate;
        // const arr = this.state.selectedFile;
        let evtarr = event.target.files;
        console.log("evtarr", evtarr);
        handleToUpdate(evtarr);
    }

    render() {
        return (
            <div className="fl">
                <input
                    className="btnFile modalbtnfile "
                    type="file"
                    multiple
                    text="attach file"
                    onChange={this.onFileChange}
                />
            </div>
        )
    }
}

export default FileComp
