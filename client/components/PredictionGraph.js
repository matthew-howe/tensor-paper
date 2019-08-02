import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactChartkick, {BarChart} from 'react-chartkick'
import {Chart as ChartJS} from 'chart.js'

ReactChartkick.addAdapter(ChartJS)

export default class PredictionGraph extends Component {
  render() {
    return (
      <div>
        <BarChart
          data={[
            {
              name: 'Rock',
              data: {'0': this.props.allResults[0]},
              color: 'red'
            },
            {
              name: 'Rock',
              data: {'1': this.props.allResults[1]},
              color: 'green'
            },
            {
              name: 'Rock',
              data: {'2': this.props.allResults[2]},
              color: 'blue'
            }
          ]}
          height={400}
          width={600}
        />
      </div>
    )
  }
}
