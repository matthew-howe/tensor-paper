import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataThunk, postRoundsThunk } from '../reducers/index';
import LossGraph from './LossGraph';
import PredictionGraph from './PredictionGraph';

let index = 0;
let model = null;
let allResults = [0, 0, 0];
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
      lastGameResult: [0, 0, 1, 0, 0, 1, 1],
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

  async play(input) {
    if (!model) await this.startTraining();
    let results = model.predict(tf.tensor2d([this.state.lastGameResult]));
    allResults = results.dataSync();
    console.log('fasdfasdfasdfasdfasdf', allResults);
    let argMax = results.argMax(1);
    index = argMax.dataSync()[0];
    let cpu = this.cpuPlay();
    let game = input.concat(cpu);
    let result = this.calcWin(game);
    let lastGameResult = game;
    lastGameResult.push(result);
    this.setState({ lastGameResult: lastGameResult });
    let newUser = this.state.user;
    let newCpu = this.state.cpu;
    let newWl = this.state.wl;
    newUser.push(input);
    newCpu.push(cpu);
    newWl.push(result);
    let cpuBtn = cpu.toString();
    let cpuImage;
    let typebtn = typeof cpuBtn;
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
    let cpu = [[0, 1, 0], [0, 0, 1], [1, 0, 0]][index];
    //counter to predicted user throw
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
    let xs, ys;
    let labelList = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    data = this.props.dataSet;

    function setup() {
      let gameHistory = []; //maybe nest
      let userHistory = [];
      data.forEach(el => {
        let game = [];
        game = game.concat(el.cpuThrow);
        game = game.concat(el.userThrow);
        game = game.concat(el.cpuWinStatus);
        gameHistory.push(game);
        userHistory.push(el.userThrow);
      });
      xs = tf.tensor2d(gameHistory);
      ys = tf.tensor2d(userHistory);

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
        epochs: 2,
        callbacks: {
          onTrainBegin: () => {
            console.log('starting...');
          },
          onEpochEnd: (epoch, logs) => {
            console.log(epoch);
            console.log(logs.loss.toFixed(5));
            let input = tf.tensor2d([this.state.lastGameResult]);
            let results = model.predict(input);
            let newResult;
            newResult = results.dataSync();
            this.setState({ tensor: { loss: logs.loss.toFixed(5), epoch } });
            this.setState({ logs: { loss: logs } });
            this.setState({ tensorProbabilities: newResult });
          },
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            console.log('finished');
            // let input = tf.tensor2d([this.state.lastGameResult]);
            // let results = model.predict(input);
            // results.print();
            // let newResult;
            // let roundedResult;
            // newResult = results.dataSync();
            // newResult = newResult.map(Number);

            // this.setState({ tensorProbabilities: newResult });

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

    let localWins = this.state.wl.filter(el => el === -1);
    let localTies = this.state.wl.filter(el => el === 0);
    let localTotalGames = this.state.wl.length - (localTies || 0);
    console.log('local winrate', localWins, localTies, localTotalGames);
    let localWinrate = localWins.length / localTotalGames;
    let totalGames;
    let winStatus;
    let wins;
    let ties;
    let winrate;
    if (this.props.dataSet.length) {
      totalGames = this.props.dataSet.length;
      winStatus = this.props.dataSet
        .map(el => el.cpuWinStatus)
        .reduce((acc, cur) => acc + cur);
      wins = this.props.dataSet.filter(el => {
        return el.cpuWinStatus === 1;
      });
      ties = this.props.dataSet.filter(el => {
        return el.cpuWinStatus === 0;
      });
      totalGames = totalGames - ties.length;
      winrate = wins.length / totalGames;
      console.log(winrate, 'winrate');
      console.log(totalGames, wins, 'games and winstatus');
    }

    return (
      <div>
        <div className="sample">
          <div className="score">
            SCOREBOARD: <br />
            CPU WINRATE: {winrate && winrate}
            <br />
            USER WINRATE: {localWinrate && localWinrate}
            <br />
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
                  <h1>
                    CPU: <img src={this.state.cpuImg} />
                  </h1>
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
            {/* <p>
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
            </p> */}
            <p>
              ROCK %: {allResults[0] && (allResults[0] + '').slice(0, 5)}
              <br />
              PAPER %: {allResults[1] && (allResults[1] + '').slice(0, 5)}
              <br />
              SCISSORS%: {allResults && (allResults[2] + '').slice(0, 5)}
            </p>
          </div>
          <div>
            <br />
          </div>
        </div>
        <LossGraph loss={this.state.tensor.loss} />
        <PredictionGraph allResults={allResults} />
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
