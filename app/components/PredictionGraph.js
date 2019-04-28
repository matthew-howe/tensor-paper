import React, { Component } from 'react';
import { connect } from 'react-redux';

let allResults = [0, 0, 0];
export default class PredictionGraph extends Component {
  componentDidMount() {
    this.createGraph();
  }

  componentWillReceiveProps() {
    allResults = this.props.allResults;
  }
  createGraph() {
    // Generate some data
    function randomDataset() {
      var _randomNum = function() {
        return Math.floor(Math.random() * 9);
      };
      var data = {
        key: 'Languages',
        values: [
          {
            key: 'Rock',
            value: allResults[0],
          },
          {
            key: 'Paper',
            value: allResults[1],
          },
          {
            key: 'Scissors',
            value: allResults[2],
          },
        ],
      };
      return data;
    }

    var chart = d3.ez.chart
      .barChartVertical()
      .colors(d3.ez.palette.categorical(1));
    var legend = d3.ez.component.legend().title('');
    var title = d3.ez.component
      .title()
      .mainText('User Prediction Probability Distribution')
      .subText('');

    // Create chart base
    var myChart = d3
      .ez()
      .width(750)
      .height(400)
      .chart(chart)
      .legend(legend)
      .title(title)
      .on('customValueMouseOver', function(d, i) {
        d3.select('#message').text(d.value);
      });

    // Add to page
    function update() {
      var data = randomDataset();
      d3.select('#chartholder')
        .datum(data)
        .call(myChart);
    }

    update();
    setInterval(update, 2000);
  }

  render() {
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', this.props);
    return (
      <div>
        <div id="chartholder" />
      </div>
    );
  }
}
