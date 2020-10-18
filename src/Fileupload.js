import "./Fileupload.css";
import React, { Component } from "react";
import OnedriveComp from "./OnedriveComp"
import FileComp from "./FileComp"
import DisplayFile from "./DisplayFile"
// import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-modal";
// import minus from "./minus.svg"
// import Swal from 'sweetalert2'
// import * as Msal from "msal";
// import { GraphFileBrowser } from "@microsoft/file-browser";
// import GetFile from "./GetFile"
// import { Sortable } from '@progress/kendo-react-sortable';
// import FeatherIcon from 'feather-icons-react';



class Fileupload extends Component {
  constructor(props) {
    super();
    this.state = {
      // fetchedToken: "",
      // open: false,
      // showBtns: true,
      // showOvedrive: true,
      // Filekeys: "",
      // Initially, no file is selected
      selectedFile: [],
      base64: [],
      // allfiles: [],
      // testState: true,
    };

    this.getBase = this.getBase.bind(this);
    this.handleToUpdate = this.handleToUpdate.bind(this);
    this.handleToRemove = this.handleToRemove.bind(this);


  }

  handleToUpdate(someArg) {
    if (someArg.length === undefined) {
      const arr = this.state.selectedFile;
      // console.log("downloadurl", someArg)
      const found = arr.some(el => el.name === someArg.name);
      if (found) alert(someArg.name + " Already exists!!!");
      if (!found) {
        this.setState({ selectedFile: [...this.state.selectedFile, someArg] });
      }
    }
    else {
      const arr = this.state.selectedFile;
      const argArr = someArg;
      let filterfiles = [];
      Object.keys(argArr).forEach(key => {
        const found = arr.some(el => el.name === argArr[key].name);
        if (found) alert(argArr[key].name + " Already exists!!!");
        if (!found) filterfiles.push(argArr[key]);
      });
      this.setState({ selectedFile: [...this.state.selectedFile, ...filterfiles] });
    }
  }


  handleToRemove(someArg) {
    this.setState({ selectedFile: someArg });
  }


  getBase() {
    let baseCode = [];
    const arr = this.state.selectedFile;
    Object.keys(arr).forEach(key => {

      console.log("flg", arr[key]['@microsoft.graph.downloadUrl']);
      if (arr[key]['@microsoft.graph.downloadUrl']) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", arr[key]['@microsoft.graph.downloadUrl'], true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
          console.log(this.response);
          var reader = new FileReader();
          reader.onload = function (event) {
            var res = event.target.result;
            //console.log("onedrive base", res)
            baseCode.push(res);
          }
          var file = this.response;
          reader.readAsDataURL(file)
        };
        xhr.send()
      }
      else {
        let reader = new FileReader();
        reader.readAsDataURL(arr[key]);
        reader.onload = (f) => {
          var res = f.target.result;
          //console.log("Attachment Base64 Format", f.target.result);
          baseCode.push(res);
        };
      }

      // console.log("baseCode", baseCode);
      this.setState({ base64: baseCode });


    });
  }


  render() {
    var handleToUpdate = this.handleToUpdate;
    console.log(this.state.selectedFile);
    const { open } = this.state;
    return (
      <div>
        <h5>Attachments:</h5>
        <div className="card1 col-sm-12">
          <div>
            <div className="fl fltxt">Upload files:</div>
            <OnedriveComp handleToUpdate={handleToUpdate.bind(this)} />
            <FileComp handleToUpdate={handleToUpdate.bind(this)} />
            {/* <button onClick={this.getBase}></button> */}
          </div>
        </div>
        <DisplayFile data={this.state.selectedFile}
          handleToRemove={this.handleToRemove.bind(this)} />

      </div>

    );
  }
}

export default Fileupload;
