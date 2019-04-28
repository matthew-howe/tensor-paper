import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataThunk, postRoundsThunk } from '../reducers/index';
import LossGraph from './LossGraph';

let index = 0;
let model = null;
class Tensor extends Component {
  constructor() {
    super();
    this.state = {
      tensor: {
        loss: 0,
        epoch: 0,
        model: null,
      },
      user: [],
      cpu: [],
      wl: [],
      cpuImg: null,
      userImg: null,
      gameNum: 0,
      results: [],
      batchComplete: false,
      lastGameResult: [1, 0, 0, 1, 0, 0, 0],
    };
  }

  async componentWillMount() {
    await this.props.fetchData();
    console.log(1);
  }
  async componentDidMount() {
    this.props.getRounds();
  }

  userButton(img) {
    this.setState({ userImg: img });
  }

  // const input = tf.tensor2d([
  //   [r, g, b]
  // ]);
  // let results = model.predict(input);
  // let argMax = results.argMax(1);
  // let index = argMax.dataSync()[0];
  // let label = labelList[index];
  // labelP.html(label);

  play(input) {
    if (!model) this.startTraining();
    let results = model.predict(tf.tensor2d([this.state.lastGameResult]));
    // prediction = prediction.dataSync();
    let argMax = results.argMax(1);
    index = argMax.dataSync()[0];
    console.log(index, 'asdfsafdfasdfsafzzzzzzzzzzzzzzzzzz');

    let cpu = this.cpuPlay();
    let game = input.concat(cpu);
    let result = this.calcWin(game);
    let lastGameResult = game;
    lastGameResult.push(result);
    console.log('LGR', lastGameResult);
    this.setState({ lastGameResult: lastGameResult });
    let newUser = this.state.user;
    let newCpu = this.state.cpu;
    let newWl = this.state.wl;
    console.log(this.state, 'PROPasdfasdfasdfS');
    newUser.push(input);
    newCpu.push(cpu);
    newWl.push(result);
    let cpuBtn = cpu.toString();
    let cpuImage;
    let typebtn = typeof cpuBtn;
    console.log('cpu throw', cpu, 'player throw', input, 'result', result);
    switch (cpuBtn) {
      case '1,0,0':
        cpuImage = 'https://i.imgur.com/adraueg.jpg';
        break;
      case '0,1,0':
        cpuImage = 'https://i.imgur.com/f85yLy6.jpg';
        break;
      case '0,0,1':
        cpuImage = 'https://i.imgur.com/eGRmmHO.jpg';
        break;
      default:
        console.log('switch fn error');
    }
    let gameResult;
    console.log('result is', result);
    switch (result) {
      case 1:
        gameResult = 'Lose';
        break;
      case 0:
        gameResult = 'Tie';
        break;
      case -1:
        gameResult = 'Win';
        break;
      default:
        console.log('switch fn error');
    }
    let setOver = this.calcSetOver(newWl);
    let newResults = this.state.results;
    newResults.push(gameResult);
    this.setState(state => {
      return {
        user: newUser,
        cpu: newCpu,
        wl: newWl,
        cpuImg: cpuImage,
        results: newResults,
        batchComplete: setOver,
      };
    });
    console.log('setover', setOver);
    if (setOver) {
      let numGames = this.state.user.length;
      let nullArray = [0, 0, 0];
      let newUser = this.state.user;
      let newCpu = this.state.cpu;
      let newWl = this.state.wl;
      while (newWl.length < 9) {
        newUser.push(nullArray);
        newCpu.push(nullArray);
        newWl.push(0);
      }

      //after postingTo db
      console.log(this.state, 'STATE');
      this.props.postRounds(this.state);
      this.props.fetchData();
      //POST TO DB

      this.setState(state => {
        return {
          user: [],
          cpu: [],
          wl: [],
          cpuImg: null,
          userImg: null,
          gameNum: 0,
          results: [],
          batchComplete: false,
        };
      });
      this.startTraining();
    }
  }

  cpuPlay() {
    let cpu = [[1, 0, 0], [0, 1, 0], [0, 0, 1]][index];
    return cpu;
  }

  calcWin(game) {
    const outcomes = [
      // user => cpu
      [1, 0, 0, 0, 0, 1], // WINS rock vs scissors
      [0, 1, 0, 1, 0, 0], // paper vs rock
      [0, 0, 1, 0, 1, 0], // scissors vs paper
      [1, 0, 0, 0, 1, 0], // LOSSES  rock vs paper
      [0, 1, 0, 0, 0, 1], // paper vs scissors
      [0, 0, 1, 1, 0, 0], // scissors vs rock
    ];
    console.log('game', game);

    let result = 0;
    for (let i = 0; i < outcomes.length; i++) {
      if (outcomes[i].every((val, idx) => val === game[idx])) {
        console.log(i);
        i >= 3 ? result++ : result--;
      }
    }
    return result;
  }

  calcSetOver(wl) {
    if (wl.length >= 9) return true;
    let sum = wl.reduce((acc, el) => acc + el, 0);
    if (sum === -5 || sum === 5) return true;
    return false;
  }

  startTraining() {
    let data;
    // let model;
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
      console.log('the model', model);
      train();
    }

    const train = async () => {
      await model.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 25,
        callbacks: {
          onTrainBegin: () => {
            console.log('starting...');
          },
          onEpochEnd: (epoch, logs) => {
            console.log(epoch);
            console.log(logs.loss.toFixed(5));
            this.setState({ tensor: { loss: logs.loss.toFixed(5), epoch } });
            this.setState({ logs: { loss: logs } });
          },
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            console.log('finished');
            let input = tf.tensor2d([this.state.lastGameResult]);
            let results = model.predict(input);
            results.print();
            let newResult;
            let roundedResult;
            newResult = results.dataSync();
            console.log(newResult, 'HERE');
            newResult = newResult.map(Number);
            // this.setState({ tensor: { model: model } });
            console.log('the model', model);

            console.log(newResult, 'NEW RESULT');
            this.setState({ tensorProbabilities: newResult });

            console.log('THIS STATE', this.state.tensorProbabilities);
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
    console.log(this.props, 'PROPS HERE', this.state, 'STATE HERE');
    return (
      <div>
        <div className="sample">
          <div className="score">
            SCOREBOARD: <br />
            {this.state.results &&
              this.state.results.map((el, idx) => (
                <div>
                  {' '}
                  GAME {idx + 1}: {el}{' '}
                </div>
              ))}
          </div>
          <div>
            <div>
              <div>
                <div className="userInput">
                  {/* <img src="https://i.imgur.com/f85yLy6.jpg" />
        <img src="https://i.imgur.com/adraueg.jpg" />
        <img src="https://i.imgur.com/eGRmmHO.jpg" /> */}
                  <h1>
                    CPU: <img src={this.state.cpuImg} />
                  </h1>
                  {/* <button id="1,0,0">ROCK</button>
        <button id="0,1,0">PAPER</button>
        <button id="0,0,1">SCISSORS</button> */}
                  <h1>
                    USER: <img src={this.state.userImg} />
                  </h1>
                  <button
                    id="prock"
                    onClick={() => {
                      this.play([1, 0, 0]);
                      this.userButton('https://i.imgur.com/adraueg.jpg');
                    }}
                  >
                    ROCK
                  </button>
                  <button
                    id="ppaper"
                    onClick={() => {
                      this.play([0, 1, 0]);
                      this.userButton('https://i.imgur.com/f85yLy6.jpg');
                    }}
                  >
                    PAPER
                  </button>
                  <button
                    id="pscissors"
                    onClick={() => {
                      this.play([0, 0, 1]);
                      this.userButton('https://i.imgur.com/eGRmmHO.jpg ');
                    }}
                  >
                    SCISSORS
                  </button>
                </div>
              </div>

              <div>
                <div />
              </div>
            </div>
          </div>
          <div className="tensorData">
            <p>CPU EPOCH: {this.state && this.state.tensor.epoch} </p>
            <p>CPU LOSS: {this.state && this.state.tensor.loss} </p>
            <p>
              ROCK %:{' '}
              {this.state.tensorProbabilities &&
                (this.state.tensorProbabilities[0] + '').slice(0, 5)}
              <br />
              PAPER %:{' '}
              {this.state.tensorProbabilities &&
                (this.state.tensorProbabilities[1] + '').slice(0, 5)}
              <br />
              SCISSORS%:{' '}
              {this.state.tensorProbabilities &&
                (this.state.tensorProbabilities[2] + '').slice(0, 5)}
            </p>
          </div>
          <div>
            <br />
            <button onClick={() => this.startTraining()}>START TRAINING</button>
          </div>
        </div>
        <LossGraph loss={this.state.tensor.loss} />
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
  postRounds: rounds => dispatch(postRoundsThunk(rounds)),
  getRounds: () => dispatch(fetchDataThunk()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tensor);
