import React, { Component } from 'react'
import minus from "./minus.svg"
import Swal from 'sweetalert2'
import { Sortable } from '@progress/kendo-react-sortable';
import FeatherIcon from 'feather-icons-react';

export class DisplayFile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dispFiles: [],
            selectedFiles: [],
        }
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
        // console.log("dataItem", dataItem);
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
                    <div className="dispfile dots"> <FeatherIcon icon="more-vertical" color="rgb(172,172,172)" width="18px" /> </div>
                </div>
            </div>
        );
    };

    onDragOver = (event) => {
        var handleToRemove = this.props.handleToRemove;
        this.setState({ selectedFiles: this.props.data })
        this.setState({
            selectedFiles: event.newState
        });
        handleToRemove(this.state.selectedFiles);
    }

    onNavigate = (event) => {
        var handleToRemove = this.props.handleToRemove;
        this.setState({ selectedFiles: this.props.data })
        this.setState({
            selectedFiles: event.newState
        });
        handleToRemove(this.state.selectedFiles);
    }

    opensweetalert(name) {
        Swal.fire({
            text: "Are you sure you want to remove this file?",
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value === true) {
                console.log("confirmed", name);
                this.onRemoveItem(name);
            }
        })
    }

    onRemoveItem = i => {
        var handleToRemove = this.props.handleToRemove;
        let selectedloop = this.props.data;
        console.log("selectd loop", selectedloop);
        let idx = selectedloop.findIndex(obj => obj.name === i);

        const selectedfiles = selectedloop.filter((item, j) => idx !== j);
        //this.setState({ dispFiles: selectedfiles });

        handleToRemove(selectedfiles);

        //handleToUpdate(selectedfiles);
    };
    render() {
        // console.log("dispfiles", this.state.dispFiles);
        return (
            <div id="FileNames">
                <Sortable

                    idField={'name'}
                    disabledField={'disabled'}
                    data={this.props.data}
                    itemUI={this.SortableItemUI}
                    onDragOver={this.onDragOver}
                    onNavigate={this.onNavigate}
                /></div>
        )
    }
}

export default DisplayFile
