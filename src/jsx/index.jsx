/** @jsx React.DOM */

var path = require('path');

var React = require('react');
var ReactWinJS = require('react-winjs');
var PeoplePage = require('./PeoplePage.jsx');
var OtherPage = require('./OtherPage.jsx');
var ChartPage = require('./ChartPage.jsx');

var ProfilePicture = require('./ProfilePicture.jsx');

var Data = require('fakeData.js');

//var Data=path.join(__dirname, 'FakeData.js');


var splitViewId = "rootSplitView";

var splitViewConfigs = {
    small: {
        closedDisplayMode: "none",
        openedDisplayMode: "overlay"
    },
    medium: {
        closedDisplayMode: "inline",
        openedDisplayMode: "overlay"
    },
    large: {
        closedDisplayMode: "inline",
        openedDisplayMode: "inline"
    }
};

function merge(/* objs */) {
    var result = {};
    for (var i = 0, len = arguments.length; i < len; i++) {
        var obj = arguments[i];
        if (obj) {
            for (k in obj) { result[k] = obj[k]; }
        }
    }
    return result;
}

function getMode() {
    return (
        window.innerWidth >= 1366 ? "large" :
        window.innerWidth >= 800 ? "medium" :
        "small"
    );
}

var App = React.createClass({
    getSplitViewConfig: function () {
        return splitViewConfigs[this.state.mode];
    },
    handlePeopleChanged: function (newPeople) {
        this.setState({
            people: newPeople
        });
    },
    handleNavigation: function (newLocation) {
        this.setState({
            location: newLocation
        });
    },
    handleBack: function () {
        var location = this.state.location;
        location.pop();
        this.handleNavigation(location);
    },
    handleResize: function () {
        var prevMode = this.state.mode;
        var nextMode = getMode();
            
        if (prevMode !== nextMode) {
            this.setState({ mode: nextMode });
        }
    },
    handleCommandInvoked: function (newLocation) {

        console.log("menu click"+newLocation);
        this.setState({
            location: newLocation,
            paneOpened: this.getSplitViewConfig().openedDisplayMode === "overlay" ? false : this.state.paneOpened
        });
    },
    handleTogglePane: function () {
        this.setState({ paneOpened: !this.state.paneOpened });
    },
    handleAfterClose: function () {
        this.setState({ paneOpened: false });
    },
    getInitialState: function () {
        var mode = getMode();

        var groupKey = function (data) {
            return data.name[0].toUpperCase();
        };

        var groupData = function (data) {
            return { title: groupKey(data) };
        };

        var sorter = function (a, b) {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        };

        var data = new WinJS.Binding.List(Data.people)
            .createSorted(sorter)
            .createGrouped(groupKey, groupData);

        return {
            people: data,
            mode: mode,
            location: ["people"]
        };
    },
    componentWillMount: function () {
        window.addEventListener("resize", this.handleResize);
    },
    componentWillUnmount: function () {
        window.removeEventListener("resize", this.handleResize);
        
    },
    renderPeoplePage: function () {
        return (
            <PeoplePage
                mode={this.state.mode}
                people={this.state.people}
                location={this.state.location}
                onNavigate={this.handleNavigation}
                onPeopleChanged={this.handlePeopleChanged} />
        );
    },
    renderOtherPage: function () {
        return <OtherPage location={this.state.location} />
    },
    renderChartPage:function(){
        
        return <ChartPage location={this.state.location} />

    },
    renderContent: function () {

        console.log("render content page");
        if (this.state.location.length === 0 || this.state.location[0] === "people") {
            return this.renderPeoplePage();
        }else if(this.state.location[0] === "chart"){
            
            return this.renderChartPage();

        } else {
            return this.renderOtherPage();
        }
    },
    renderBackButton: function () {
        var canGoBack = this.state.location.length > 1;
        var shouldShowBackButton = canGoBack && this.state.mode === "small";
        return shouldShowBackButton ?
            <button style={{display: "inline-block"}} className="win-backbutton" onClick={this.handleBack} /> :
            null;
    },
    render: function () {

        console.log("render page");
        var paneComponent = (
            <div>
                <ReactWinJS.SplitView.Command
                    label="People"
                    icon="contact"
                    onInvoked={this.handleCommandInvoked.bind(null, ["people"])} />
                <ReactWinJS.SplitView.Command
                    label="What's New"
                    icon="comment"
                    onInvoked={this.handleCommandInvoked.bind(null, ["new"])} />
                <ReactWinJS.SplitView.Command
                    label="Groups"
                    icon="people"
                    onInvoked={this.handleCommandInvoked.bind(null, ["groups"])} />

                <ReactWinJS.SplitView.Command
                    label="图表测试"
                    icon="people"
                    onInvoked={this.handleCommandInvoked.bind(null, ["chart"])} />

                <ReactWinJS.SplitView.Command
                    style={{position: "absolute", bottom: 0, width: "100%"}}
                    label="Settings"
                    icon="settings"
                    onInvoked={this.handleCommandInvoked.bind(null, ["settings"])} />
            </div>
        );

        var contentComponent = this.renderContent();

        return (
            <div style={{height: "100%"}}>
                <div style={{height: 48, backgroundColor: "rgb(1, 121, 216)"}} className="win-ui-dark">
                    <ReactWinJS.SplitViewPaneToggle
                        aria-controls={splitViewId}
                        style={{display:'inline-block'}}
                        paneOpened={this.state.paneOpened}
                        onInvoked={this.handleTogglePane} />
                    {this.renderBackButton()}
                    <h3 className="win-h3" style={{display: "inline-block", marginLeft: 5}}>中午好</h3>
                </div>
                <ReactWinJS.SplitView
                    id={splitViewId}
                    style={{height: "calc(100% - 48px)"}}
                    paneComponent={paneComponent}
                    contentComponent={contentComponent}
                    onAfterClose={this.handleAfterClose}
                    paneOpened={this.state.paneOpened}
                    {...this.getSplitViewConfig()} />
            </div>
        );
    }
});

React.render(<App />, document.getElementById("app"));
