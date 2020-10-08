import React, { Component } from "react";
import { GraphFileBrowser } from "@microsoft/file-browser";
import { Modal } from "react-responsive-modal";
class App extends Component {
  state = {
    open: false,
  }

  render() {
    return (
      <div>
        <Modal id="mdl" open={window.open} onClose={this.onCloseModal} center>
          <GraphFileBrowser
            getAuthenticationToken={this.getAuthenticationToken}
            onSuccess={this.onSuccess}
            onCancel={this.onCancel}
            selectionMode="multiple"
          />
        </Modal>

        <button onClick={this.onOpenModal}>Onedrive</button>
        {/* {this.launchOneDrivePicker()} */}
      </div>
    );
  }

  // launchOneDrivePicker() {
  //   console.log("inside fn")
  //   return (

  //     // <div className="filepickerdiv">
  //     //   tssse
  //     //   {/* <GraphFileBrowser
  //     //     getAuthenticationToken={this.getAuthenticationToken}
  //     //     onSuccess={this.onSuccess}
  //     //     onCancel={this.onCancel}
  //     //     selectionMode="multiple"
  //     //   /> */}
  //     // </div>
  //   );
  // }

  getAuthenticationToken() {
    return Promise.resolve(
      "eyJ0eXAiOiJKV1QiLCJub25jZSI6IktZdlc4dy1RVzZqc2NkNE1fb094cUdZb2R2ZTM3VXN0SGtRbG1sY3FqMm8iLCJhbGciOiJSUzI1NiIsIng1dCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyIsImtpZCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMjBkNzFjMS03YjgxLTQ4YmEtODExNy1jYzJjM2MxYmI1MTgvIiwiaWF0IjoxNjAxMzY1NzMxLCJuYmYiOjE2MDEzNjU3MzEsImV4cCI6MTYwMTM2OTYzMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhSQUFBQWhXSFlrb29rblowZlFaU1FHSWw5bGtad3o0WGNLM3Q3L3Nqb2o5MGcrcW89IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBleHBsb3JlciAob2ZmaWNpYWwgc2l0ZSkiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVmF0dGFra292dmFsIiwiZ2l2ZW5fbmFtZSI6IlJvc2hpdCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE1Ny40NC4yMTEuMTE4IiwibmFtZSI6InJvc2hpdCBWYXR0YWtrb3Z2YWwiLCJvaWQiOiI0OWQ4ZTczNC02NjA3LTQwYTktYWEwNy02MmMyYjFlZmM3MGMiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDA5MDA2REYzOCIsInJoIjoiMC5BUXdBd1hFTk1vRjd1a2lCRjh3c1BCdTFHTFhJaTk3NTJiRklxSzIzU05weVVHUU1BS2cuIiwic2NwIjoiRmlsZXMuUmVhZCBGaWxlcy5SZWFkLkFsbCBGaWxlcy5SZWFkV3JpdGUgRmlsZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBTaXRlcy5SZWFkLkFsbCBTaXRlcy5SZWFkV3JpdGUuQWxsIFVzZXIuUmVhZCBlbWFpbCIsInN1YiI6ImVzVnlOY0xPcmhtekdhVXBwLXI5NXNIbTlzQVNaV2lFSmdxQjVlclMwT2MiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiIzMjBkNzFjMS03YjgxLTQ4YmEtODExNy1jYzJjM2MxYmI1MTgiLCJ1bmlxdWVfbmFtZSI6InJvc2hpdEByZXNlbWJsZXN5c3RlbXMuY29tIiwidXBuIjoicm9zaGl0QHJlc2VtYmxlc3lzdGVtcy5jb20iLCJ1dGkiOiIwUFRGNmNhakxrS2pIdVl1UmpsaEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IkJXQlU5TW5qYl9zUzhnV0l2d3dRdGpVQzBKbE5CWHl3T1IxeGdHV285dXcifSwieG1zX3RjZHQiOjE0MDYyOTMwNjR9.OCqIz2uZawarGzDdj2aCc6ijCpg0vGOSzgzqNAoSaeweUGCISo41i2hYw0Ll7W7lIb3ZnRtmfMX3vxwOIZYyvq2LSowbgKZkQnF9sbJmf-gOrT5-VoWmcfkRjcG7at6ztZ3xeyKB8UDjburGzjoGDsSyCjaqKlIPG5VaKtu7SgUeT7kmxbmwuq8sYmrlDnbit1qiEbzEHRKS8hcYt1t7E23s1zTKMxUOM6d4HyDJQ6GNz-6L9aqx1rwNdLjh9LDLyXzILqHRmjKvjoIa-nuE5brTrAcP91PGsJkojJQvN8bM1Aiood40ng9kz4d-Ae1k0bg0s7so81ybtgXlbhG_zQ"
    );
  }

  onSuccess(files) {
    console.log("onSuccess", files);
  }

  onCancel(err) {
    console.log("onCancel", err.message);
  }


  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
}
export default App;
// ReactDOM.render(<App />, mountNode);
