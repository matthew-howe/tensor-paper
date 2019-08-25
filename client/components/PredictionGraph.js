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
              color: '#6AAAD6'
            },
            {
              name: 'Paper',
              data: {'1': this.props.allResults[1]},
              color: '#173D4E'
            },
            {
              name: 'Scissors',
              data: {'2': this.props.allResults[2]},
              color: 'orange'
            }
          ]}
          height={400}
          width={600}
        />
      </div>
    )
  }
}
