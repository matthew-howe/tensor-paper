import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchDataThunk, postRoundsThunk} from '../store/rootReducer'
import LossGraph from './LossGraph'
import PredictionGraph from './PredictionGraph'
// import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'

// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   input: {
//     display: 'none',
//   },
// }));

let index = 0
let model = null
let allResults = [0, 0, 0]
class Tensor extends Component {
  constructor() {
    super()
    this.state = {
      tensor: {
        loss: 0.5,
        epoch: 0,
        model: null
      },
      learningRate: 20,
      epochs: 5,
      user: [],
      cpu: [],
      wl: [],
      cpuImg: null,
      userImg: null,
      gameNum: 0,
      results: [],
      batchComplete: false,
      lastGameResult: [0, 0, 0, 0, 0, 0, 0]
    }
  }

  async componentWillMount() {
    await this.props.fetchData()
  }
  async componentDidMount() {
    this.props.getRounds()
  }

  userButton(img) {
    this.setState({userImg: img})
  }

  play(input) {
    if (!model) this.startTraining()

    let cpu = this.cpuPlay()
    let game = input.concat(cpu)
    let result = this.calcWin(game)
    let lastGameResult = game
    lastGameResult.push(result)

    this.setState({lastGameResult: lastGameResult})
    let results = model.predict(tf.tensor2d([this.state.lastGameResult]))
    allResults = results.dataSync()
    let argMax = results.argMax(1)
    index = argMax.dataSync()[0]
    let newUser = this.state.user
    let newCpu = this.state.cpu
    let newWl = this.state.wl
    newUser.push(input)
    newCpu.push(cpu)
    newWl.push(result)
    let cpuBtn = cpu.toString()
    let cpuImage
    let typebtn = typeof cpuBtn
    switch (cpuBtn) {
      case '1,0,0':
        cpuImage = 'https://i.imgur.com/adraueg.jpg'
        break
      case '0,1,0':
        cpuImage = 'https://i.imgur.com/f85yLy6.jpg'
        break
      case '0,0,1':
        cpuImage = 'https://i.imgur.com/eGRmmHO.jpg'
        break
      default:
        console.log('switch fn error')
    }
    let gameResult
    switch (result) {
      case 1:
        gameResult = 'Lose'
        break
      case 0:
        gameResult = 'Tie'
        break
      case -1:
        gameResult = 'Win'
        break
      default:
        console.log('switch fn error')
    }
    let setOver = this.calcSetOver(newWl)
    let newResults = this.state.results
    newResults.push(gameResult)
    this.setState(state => {
      return {
        user: newUser,
        cpu: newCpu,
        wl: newWl,
        cpuImg: cpuImage,
        results: newResults,
        batchComplete: setOver
      }
    })
    if (setOver) {
      let numGames = this.state.user.length
      let nullArray = [0, 0, 0]
      let newUser = this.state.user
      let newCpu = this.state.cpu
      let newWl = this.state.wl
      while (newWl.length < 9) {
        newUser.push(nullArray)
        newCpu.push(nullArray)
        newWl.push(0)
      }

      //after postingTo db
      this.props.postRounds(this.state)
      this.props.fetchData()
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
          batchComplete: false
        }
      })
      this.startTraining()
    }
  }

  cpuPlay() {
    let cpu = [[0, 1, 0], [0, 0, 1], [1, 0, 0]][index]
    //counter to predicted user throw
    return cpu
  }

  calcWin(game) {
    const outcomes = [
      // cpu -> user
      [1, 0, 0, 0, 0, 1], // LOSSES rock vs scissors
      [0, 1, 0, 1, 0, 0], // paper vs rock
      [0, 0, 1, 0, 1, 0], // scissors vs paper
      [1, 0, 0, 0, 1, 0], // WINS  rock vs paper
      [0, 1, 0, 0, 0, 1], // paper vs scissors
      [0, 0, 1, 1, 0, 0] // scissors vs rock
    ]

    let result = 0
    for (let i = 0; i < outcomes.length; i++) {
      if (outcomes[i].every((val, idx) => val === game[idx])) {
        i >= 3 ? result++ : result--
      }
    }
    return result
  }

  calcSetOver(wl) {
    if (wl.length >= 9) return true
    let sum = wl.reduce((acc, el) => acc + el, 0)
    if (sum === -5 || sum === 5) return true
    return false
  }

  startTraining() {
    let data
    let xs, ys
    let labelList = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    data = this.props.dataSet

    const setup = () => {
      let gameHistory = [] //maybe nest
      let userHistory = []
      data.forEach(el => {
        let game = []
        game = game.concat(el.cpuThrow)
        game = game.concat(el.userThrow)
        game = game.concat(el.cpuWinStatus)
        gameHistory.push(game)
        userHistory.push(el.userThrow)
      })
      xs = tf.tensor2d(gameHistory)
      ys = tf.tensor2d(userHistory)

      model = tf.sequential()
      const hidden = tf.layers.dense({
        units: 16,
        inputShape: [7],
        activation: 'sigmoid'
      })
      const output = tf.layers.dense({
        units: 3,
        activation: 'softmax'
      })
      model.add(hidden)
      model.add(output)

      const LEARNING_RATE = this.state.learningRate * 0.01
      const optimizer = tf.train.sgd(LEARNING_RATE)

      model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      })
      train()
    }

    const train = async () => {
      await model.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.2,
        epochs: this.state.epochs,
        callbacks: {
          onTrainBegin: () => {
            console.log('starting...')
          },
          onEpochEnd: (epoch, logs) => {
            let input = tf.tensor2d([this.state.lastGameResult])
            let results = model.predict(input)
            let newResult
            newResult = results.dataSync()
            this.setState({tensor: {loss: logs.loss.toFixed(5), epoch}})
            this.setState({logs: {loss: logs}})
            this.setState({tensorProbabilities: newResult})
          },
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame()
          },
          onTrainEnd: () => {
            console.log('finished')
          }
        }
      })
    }
    setup()
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    let localTies = [0]
    let localWins = this.state.wl.filter(el => el === -1)
    localTies = this.state.wl.filter(el => el === 0)
    let localTotalGames = this.state.wl.length - localTies.length
    let localWinrate = localWins.length / localTotalGames
    if (isNaN(localWinrate)) localWinrate = 'No Matches Completed'
    let totalGames
    let winStatus
    let wins
    let ties
    let winrate
    if (this.props.dataSet.length) {
      totalGames = this.props.dataSet.length
      winStatus = this.props.dataSet
        .map(el => el.cpuWinStatus)
        .reduce((acc, cur) => acc + cur)
      wins = this.props.dataSet.filter(el => {
        return el.cpuWinStatus === 1
      })
      ties = this.props.dataSet.filter(el => {
        return el.cpuWinStatus === 0
      })
      totalGames = totalGames - ties.length
      winrate = wins.length / totalGames
    }

    return (
      <div>
        <div className="sample">
          <div className="score">
              <div className="score-title">
                  BEST OF 9 <br /><br />
        </div>
            CPU WINRATE: {winrate && winrate.toFixed(2)}
            <br />
            USER WINRATE: {localWinrate === 'No Matches Completed' ?
                    'Infinity' : localWinrate.toFixed(2)}
            <br />
            <br />
            {this.state.results &&
              this.state.results.map((el, idx) => (
                <div key={Math.random()}>
                  {' '}
                  GAME {idx + 1}: {el}{' '}
                </div>
              ))}
          </div>

          <div className="userInput">
              <div className="hands">
            <h1>
              CPU: <img src={this.state.cpuImg} />
            </h1>
            <h1>
              USER: <img src={this.state.userImg} />
            </h1>
        </div>
            <div className="input-buttons">
                <div>
            <Button
              id="prock"
              onClick={() => {
                this.play([1, 0, 0])
                this.userButton('https://i.imgur.com/adraueg.jpg')
              }}
              variant="contained"
              color="inherit"
            >
              ROCK
            </Button>
        </div>
        <div>
            <Button
              id="ppaper"
              onClick={() => {
                this.play([0, 1, 0])
                this.userButton('https://i.imgur.com/f85yLy6.jpg')
              }}
              variant="contained"
              color="inherit"
            >
              PAPER
            </Button>
        </div>
        <div>
            <Button
              id="pscissors"
              onClick={() => {
                this.play([0, 0, 1])
                this.userButton('https://i.imgur.com/eGRmmHO.jpg ')
              }}
              variant="contained"
              color="inherit"
            >
              SCISSORS
            </Button>
        </div>
        </div>
          </div>
          <div className="tensorData">
            <p>LOSS: {this.state && this.state.tensor.loss} </p>
            <div className="slidecontainer">
              <div>EPOCHS: {this.state.epochs}</div>
              <input
                name="epochs"
                onChange={e => {
                  this.handleChange(e)
                }}
                type="range"
                min="1"
                max="20"
                value={this.state.epochs}
                className="slider"
              />
              <br />
              <br />

              <div>
                LEARNING RATE: {(this.state.learningRate * 0.01).toFixed(2)}
              </div>

              <input
                name="learningRate"
                onChange={e => {
                  this.handleChange(e)
                }}
                type="range"
                min="1"
                max="100"
                value={this.state.learningRate}
                className="slider"
              />
            </div>

            <p>
              ROCK %: {allResults[0] && (allResults[0] + '').slice(0, 5)}
              <br />
              PAPER %: {allResults[1] && (allResults[1] + '').slice(0, 5)}
              <br />
              SCISSORS%: {allResults && (allResults[2] + '').slice(0, 5)}
            </p>
          </div>
        </div>
        <div className="Graphs">
          <LossGraph loss={this.state.tensor.loss} />
          <PredictionGraph allResults={allResults} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataSet: state.rootReducer.dataSet
  }
}

const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchDataThunk())
  },
  postRounds: rounds => dispatch(postRoundsThunk(rounds)),
  getRounds: () => dispatch(fetchDataThunk())
})

export default connect(mapStateToProps, mapDispatchToProps)(Tensor)
