/**
显示剩余chart图
**/

var React = require('react');

var urlToContent = {
    "new": "What's New",
    groups: "Groups",
    settings: "Settings"
};

var ChartPage = React.createClass({
    propTypes: {
        location: React.PropTypes.array.isRequired
    },
    componentDidMount: function() {
        
        var myCircle = Circles.create({
  id:                  'circles-1',
  radius:              60,
  value:               23,
  maxValue:            100,
  width:               3,
  text:                function(value){return value + '%';},
  colors:              ['#0080FF', '#4B253A','#00A600'],
  duration:            400,
  wrpClass:            'circles-wrp',
  textClass:           'circles-text',
  valueStrokeClass:    'circles-valueStroke',
  maxValueStrokeClass: 'circles-maxValueStroke',
  styleWrapper:        true,
  styleText:           true
});

    },
    render: function () {

        var title = urlToContent[this.props.location] || "ChartPage";
        return (<div >
            <div className="circle-holder">
                <div className="circle" id="circles-1"></div>
            </div>
            <div className="separator" />

            <button>this is button</button>
         </div>);
    }
});

module.exports = ChartPage;
