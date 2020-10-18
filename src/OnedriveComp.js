import React, { Component } from 'react'
import FeatherIcon from 'feather-icons-react';
import * as Msal from "msal";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { GraphFileBrowser } from "@microsoft/file-browser";
import GetFile from "./GetFile"

const msalConfig = {
    auth: {

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

class OnedriveComp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            fetchedToken: "",
            selectedFile: [],
        }
        this.getAuthenticationToken = this.getAuthenticationToken.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onCancel = this.onCancel.bind(this);
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

                                this.setState({ showBtns: !this.state.showBtns });

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
        var handleToUpdate = this.props.handleToUpdate;
        console.log("keys", keys);
        console.log("length", keys.length);

        keys.map((item, index) => (
            GetFile(this.state.fetchedToken, keys[index].driveItem_203[2])
                .then((d) => {
                    console.log("Filedetails onedrive", d);
                    console.log("FileName-", d.name);

                    handleToUpdate(d);
                    // this.setState({ selectedFile: [...this.state.selectedFile, d] });
                    //}
                    // this.setState({ showBtns: !this.state.showBtns });
                    this.setState({ open: false });
                }
                )
        ));

        //handleToUpdate(this.state.selectedFile);
    }

    onCancel(err) {
        console.log("onCancel", err.message);
        this.setState({ showBtns: !this.state.showBtns });

        this.setState({ open: false });
    }
    onOpenModal = () => {
        this.setState({ open: true });

    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {

        const { open } = this.state;
        return (
            <div className="fl">

                <button className="attachBtn" onClick={this.seeToken.bind(this)} >
                    <FeatherIcon icon="download-cloud" color=" #a65782" />  Onedrive
            </button><span id="ortxt"> or </span>
                <Modal id="mdl" open={open} onClose={this.onCloseModal} center>

                    <div className="filesection"> {this.state.fetchedToken !== "" ?
                        <GraphFileBrowser
                            getAuthenticationToken={this.getAuthenticationToken}
                            onSuccess={this.onSuccess}
                            onCancel={this.onCancel}
                            selectionMode="multiple"
                        />
                        : null}</div>
                </Modal>
            </div>

        )
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

export default OnedriveComp
