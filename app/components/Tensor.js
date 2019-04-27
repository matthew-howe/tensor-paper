import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataThunk } from '../reducers/index';
class Tensor extends Component {
  constructor() {
    super();
    this.state = {
      tensor: {
        loss: 0,
        epoch: 0,
      },
    };
  }

  async componentWillMount() {
    await this.props.fetchData();
    console.log(1);
  }
  async componentDidMount() {
    await console.log(this.props, 'COMP DID MOUNT PROPS');
    console.log(2);
  }
  startTraining() {
    let data;
    let model;
    let xs, ys;

    let labelList = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    //    let data = this.props.dataSet
    data = this.props.dataSet;

    function setup() {
      //    let data = this.props.dataSet
      // Crude interface

      let gameHistory = []; //maybe nest
      let userHistory = [];
      // gameHistory[0].push([0, 0, 0, 0, 0, 0, 0]);
      data.forEach(el => {
        let game = [];
        game = game.concat(el.cpuThrow);
        game = game.concat(el.userThrow);
        game = game.concat(el.cpuWinStatus);
        gameHistory.push(game);
        userHistory.push(el.userThrow);
      });
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa', gameHistory, userHistory);
      xs = tf.tensor2d(gameHistory);
      ys = tf.tensor2d(userHistory);

      // // ys = tf.oneHot(userHistoryTensor, 3).cast('float32');
      // userHistoryTensor.dispose();

      model = tf.sequential();
      const hidden = tf.layers.dense({
        units: 16,
        inputShape: [7],
        activation: 'sigmoid',
      });
      const output = tf.layers.dense({
        units: 3,
        activation: 'softmax',
      });
      model.add(hidden);
      model.add(output);

      const LEARNING_RATE = 0.25;
      const optimizer = tf.train.sgd(LEARNING_RATE);

      model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });

      train();
    }

    const train = async () => {
      await model.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 300,
        callbacks: {
          onTrainBegin: () => {
            console.log('starting...');
          },
          onEpochEnd: (epoch, logs) => {
            console.log(epoch);
            console.log(logs.loss.toFixed(5));
            this.setState({ tensor: { loss: logs.loss.toFixed(5), epoch } });
            this.setState({ logs: { loss: logs } });
            console.log(this.state, 'STAAAATE');
          },
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            console.log('finished');
            let input = tf.tensor2d([[1, 0, 0, 0, 1, 0, -1]]);
            let results = model.predict(input);
            results.print();
            // const prediction = model.predict(tf.randomNormal([null, 7]));
            // prediction.print();
          },
        },
      });
    };
    setup();
    // train();
  }
  render() {
    let cpuOutput = Math.random(1);
    console.log(this.props, 'PROPS HERE');
    return (
      <div>
        <h1>CPU:</h1>
        <button>ROCK</button>
        <button>PAPER</button>
        <button>SCISSORS</button>
        <p>CPU OUTPUT: {this.state && this.state.tensor.epoch} </p>
        <p>CPU OUTPUT: {this.state && this.state.tensor.loss} </p>
        <p>CPU OUTPUT: {this.state && this.state.tensor.loss} </p>>
        <h1>USER INPUT:</h1>
        <button>ROCK</button>
        <button>PAPER</button>
        <button>SCISSORS</button>
        <br />
        <button onClick={() => this.startTraining()}>START TRAINING</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dataSet: state.dataSet,
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchDataThunk());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tensor);
