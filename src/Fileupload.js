import "./Fileupload.css";
import React, { Component } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import downloadicn from "./download-cloud.svg"
import minus from "./minus.svg"
import dotsicn from "./more-vertical.svg"
import Swal from 'sweetalert2'
import * as Msal from "msal";
import { GraphFileBrowser } from "@microsoft/file-browser";
import GetFile from "./GetFile"
import { Sortable } from '@progress/kendo-react-sortable';

const msalConfig = {
  auth: {
    // clientId: "fa04c1ee-d61f-47cc-a236-c87460d11fed",
    clientId: "cc6a924f-a586-4fd8-b7b5-2f28e7c29d5b",
    authority:
      "https://login.microsoftonline.com/320d71c1-7b81-48ba-8117-cc2c3c1bb518",
    redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

const loginRequest = {
  scopes: ["openid", "profile", "Files.ReadWrite.All", "User.Read"],
};
const myMSALObj = new Msal.UserAgentApplication(msalConfig);

class Fileupload extends Component {
  constructor(props) {
    super();
    this.state = {
      fetchedToken: "",
      open: false,
      showBtns: true,
      showOvedrive: true,
      Filekeys: "",
      // Initially, no file is selected
      selectedFile: [],
      allfiles: [],
    };
    this.getAuthenticationToken = this.getAuthenticationToken.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.getBase = this.getBase.bind(this);
  }

  getBaseItemStyle = (isActive) => ({
    outline: 'none',
    display: 'inline-block',
    color: isActive ? '#fff' : '#1494d0',
    borderColor: isActive ? 'black' : 'red',
    float: 'left',
  }
  );

  SortableItemUI = (props) => {
    const { isDisabled, isActive, style, attributes, dataItem, forwardRef } = props;
    const classNames = [];
    if (isDisabled) {
      classNames.push('k-state-disabled');
    }
    //console.log("dataItem", dataItem);
    return (
      <div className="fleft">
        <div
          ref={forwardRef}
          {...attributes}
          style={{
            ...this.getBaseItemStyle(isActive), ...style
          }}
          className={classNames.join(' ')}
        >
          <div className="dispfilename dispfile ">
            {dataItem.name}<button className="fright btndeletefile" onClick={() => this.opensweetalert(dataItem.name)}><img className="imgpadding" src={minus}></img></button>
          </div>
          <div className="dispfile dots"><img src={dotsicn}></img></div>
        </div>
      </div>
    );
  };

  onDragOver = (event) => {
    this.setState({
      selectedFile: event.newState
    });
  }

  onNavigate = (event) => {
    this.setState({
      selectedFile: event.newState
    });
  }

  seeToken() {
    myMSALObj
      .loginPopup(loginRequest)
      .then((loginResponse) => {
        console.log("id_token acquired at: " + new Date().toString());
        console.log("signed in", loginResponse);

        if (myMSALObj.getAccount()) {
          console.log("myMSALObj.getAccount", myMSALObj.getAccount());
          if (myMSALObj.getAccount()) {
            getTokenPopup(loginRequest)
              .then((response) => {
                console.log("Access Token-", response.accessToken);
                this.setState({ fetchedToken: response.accessToken });
                // mailButton.classList.remove("d-none");
                this.setState({ showBtns: !this.state.showBtns });
                // this.setState({ showOvedrive: true });
                this.setState({ open: true });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  getAuthenticationToken() {
    return Promise.resolve(this.state.fetchedToken);
  }

  onSuccess = (keys) => {
    console.log("keys", keys);
    console.log("length", keys.length);

    keys.map((item, index) => (
      GetFile(this.state.fetchedToken, keys[index].driveItem_203[2])
        .then((d) => {
          console.log("Filedetails", d);
          console.log("FileName-", d.name);
          //console.log("onedrivefiles", this.state.selectedFile);

          const arr = { ...this.state.selectedFile };
          let flag = true;
          Object.keys(arr).forEach(key => {
            if (arr[key].name === d.name) {
              alert(d.name + " already exists")
              flag = false;
            }
          })
          if (flag === true) {
            this.setState({ selectedFile: [...this.state.selectedFile, d] });
          }
          // this.setState({ showBtns: !this.state.showBtns });
          this.setState({ open: false });
        }
        )
    ));
  }

  onCancel(err) {
    console.log("onCancel", err.message);
    this.setState({ showBtns: !this.state.showBtns });
    // this.setState({ showOvedrive: !this.state.showOvedrive });
    this.setState({ open: false });
  }

  opensweetalert(index) {
    Swal.fire({
      text: "Are you sure you want to remove this file?",
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value === true) {
        console.log("confirmed", index);
        this.onRemoveItem(index);
      }
    })
  }

  onOpenModal = () => {
    this.setState({ open: true });
    // this.setState({ Filekeys: "hello" });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  onRemoveItem = i => {
    let selectedloop = this.state.selectedFile;
    let idx = selectedloop.findIndex(obj => obj.name === i);
    this.setState(state => {
      const selectedFile = state.selectedFile.filter((item, j) => idx !== j);
      return {
        selectedFile,
      };
    });
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    // this.setState({ selectedFile: [...this.state.selectedFile, ...event.target.files] });
    // console.log("after", this.state.selectedFile);
    // console.log("length", event.target.files.length);
    const arr = this.state.selectedFile;
    let evtarr = event.target.files;
    let filterfils = [];

    console.log("arr", arr);
    console.log("evtarr", evtarr);
    let flag = true;
    if (arr.length === 0) {
      this.setState({ selectedFile: [...this.state.selectedFile, ...event.target.files] });
    }
    else {
      //Object.keys(evtarr).forEach(key => {
      //console.log("arraynamename=", evtarr[key].name);

      Object.keys(evtarr).forEach(key2 => {

        // if (evtarr[key].name != arr[key2].name) {
        //   alert(evtarr[key].name + " doesnot exists");
        //   console.log("eveatt", evtarr[key]);
        //   filterfils = filterfils.push(evtarr[key]);  
        // }

        const found = arr.some(el => el.name === evtarr[key2].name);
        if (found) alert(evtarr[key2].name + " Already exists!!!");
        if (!found) filterfils.push(evtarr[key2]);
      });
      this.setState({ selectedFile: [...this.state.selectedFile, ...filterfils] });

      // Object.keys(evtarr).forEach(key => {
      //   if (arr.indexOf(evtarr[key]) === -1) {
      //     alert(evtarr[key].name)
      //     this.setState({ selectedFile: [...this.state.selectedFile, evtarr[key]] });
      //   }
      // })
    }
    // let reader = new FileReader();
    // reader.readAsDataURL(this.state.selectedFile[0]);
    // reader.onload = (event) => {
    //   console.log("Attachment Base64 Format", event.target.result);
    // };
  };

  getBase() {
    let reader = new FileReader();
    const arr = this.state.selectedFile;

    Object.keys(arr).forEach(key => {
      let reader = new FileReader();
      reader.readAsDataURL(arr[key]);
      reader.onload = (f) => {
        console.log("Attachment Base64 Format", f.target.result);
      };
      // console.log("filenames=", arr[key].name);
    });

  }


  render() {
    console.log(this.state.selectedFile);
    // this.getBase()
    const { open } = this.state;
    return (
      <div>
        <h5>Attachments:</h5>
        <div className="card1">
          <div>
            <div className="fl fltxt">Upload files:</div>
            <div className="fl">
              <button className="attachBtn" onClick={this.seeToken.bind(this)} >
                <img src={downloadicn}></img> Onedrive
            </button><span id="ortxt"> or </span>
            </div>
            <div className="fl">
              <input
                className="btnFile modalbtnfile "
                type="file"
                multiple
                text="attach file"
                onChange={(e) => this.onFileChange(e)}
              // {this.onFileChange}
              />
            </div>

          </div>

          <Modal id="mdl" open={open} onClose={this.onCloseModal} center>

            <div id="filesection"> {this.state.fetchedToken !== "" ?
              <GraphFileBrowser
                getAuthenticationToken={this.getAuthenticationToken}
                onSuccess={this.onSuccess}
                onCancel={this.onCancel}
                selectionMode="multiple"
              />
              : null}</div>
          </Modal>
        </div>
        <button onClick={this.getBase.bind(this)}>
          show Base64
        </button>


        <div id="FileNames">
          <Sortable

            idField={'name'}
            disabledField={'disabled'}
            data={this.state.selectedFile}
            itemUI={this.SortableItemUI}
            onDragOver={this.onDragOver}
            onNavigate={this.onNavigate}
          /></div>
      </div>

    );
  }
}

function getTokenPopup(request) {
  return myMSALObj.acquireTokenSilent(request).catch((error) => {
    console.log(error);
    console.log("silent token acquisition fails. acquiring token using popup");

    // fallback to interaction when silent call fails
    return myMSALObj
      .acquireTokenPopup(request)
      .then((tokenResponse) => {
        return tokenResponse;
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export default Fileupload;
