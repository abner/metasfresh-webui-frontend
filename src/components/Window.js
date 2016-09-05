import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

import {
    findRowByPropName
} from '../actions/WindowActions';

import Widget from '../components/Widget';
import Tabs from '../components/widget/Tabs';
import TabPane from '../components/widget/TabPane';
import Table from '../components/table/Table';

import logo from '../assets/images/metasfresh_logo_green_thumb.png';

class Window extends Component {
    constructor(props){
        super(props);
    }
    renderTabs = (tabs) => {
        const {type} = this.props.layout;
        const {data, rowData} = this.props;
        const dataId = findRowByPropName(data,"ID").value;

        return(
            <Tabs>
                {
                    tabs.map((elem)=> {
                        const {tabid, caption, elements} = elem;
                        return (
                            <TabPane
                                caption={caption}
                                key={tabid}
                            >
                                <Table rowData={rowData} cols={elements} tabid={tabid} type={type} docId={dataId} />
                            </TabPane>
                        )
                    })
                }
            </Tabs>
        )
    }
    renderSections = (sections) => {
        return sections.map((elem, id)=> {
            const columns = elem.columns;
            return (
                <div className="row" key={"section" + id}>
                    {columns && this.renderColumns(columns)}
                </div>
            )
       })
    }
    renderColumns = (columns) => {
        const maxRows = 12;
        const colWidth = Math.floor(maxRows / columns.length);
        return columns.map((elem, id)=> {
            const elementGroups = elem.elementGroups;
            return (
                <div className={"col-xs-" + colWidth} key={'col' + id}>
                    {elementGroups && this.renderElementGroups(elementGroups)}
                </div>
            )
        })
    }
    renderElementGroups = (group) => {
        return group.map((elem, id)=> {
            const {type, elementsLine} = elem;
            return (
                elementsLine && elementsLine.length > 0 &&
                    <div
                        key={'elemGroups' + id}
                        className={"panel panel-spaced panel-distance " + ((type === "primary") ? "panel-bordered panel-primary" : "panel-secondary")}
                    >
                        {this.renderElementsLine(elementsLine)}
                    </div>
            )
        })
    }
    renderElementsLine = (elementsLine) => {
        return elementsLine.map((elem, id)=> {
            const {elements} = elem;
            return (
                elements && elements.length > 0 &&
                    <div className="elements-line" key={"line" + id}>
                        {this.renderElements(elements)}
                    </div>
            )
        })
    }
    renderElements = (elements) => {
        const {type} = this.props.layout;
        const {data, modal, tabId} = this.props;
        return elements.map((elem, id)=> {
            const dataId = findRowByPropName(data,"ID").value;
            let widgetData = elem.fields.map(item => findRowByPropName(data, item.field));

            return (
                <Widget
                    key={'element' + id}
                    windowType={type}
                    dataId={dataId}
                    widgetData={widgetData}
                    isModal={!!modal}
                    tabId={tabId}
                    {...elem} />
            )
        })
    }

    render() {
        const {sections, type, tabs} = this.props.layout;
        const {data} = this.props;
        return (
            <div>
                <div className="container header-sticky-distance" key="window">
                    {sections && this.renderSections(sections)}
                    <div className="m-t-1 m-b-2">
                        {tabs && this.renderTabs(tabs)}
                    </div>
                </div>
            </div>
        );
    }
}

Window.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
    }
}

Window = connect(mapStateToProps)(Window)

export default Window;