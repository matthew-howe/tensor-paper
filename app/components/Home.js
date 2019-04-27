import React, { Component } from "react";
import { connect } from "react-redux";
import { postRoundsThunk, fetchDataThunk } from "../reducers";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
      cpu: [],
      wl: [],
      cpuImg: null,
      userImg: null,
      gameNum: 0,
      results: [],
      batchComplete: false
    };
    this.play.bind(this);
    this.cpuPlay.bind(this);
    this.calcWin.bind(this);
    this.calcSetOver.bind(this);
    this.cpuButton.bind(this);
    this.userButton.bind(this);
  }
  componentDidMount() {
    this.props.getRounds();
  }
  cpuButton(img) {
    this.setState({ cpuImg: img });
  }

  userButton(img) {
    this.setState({ userImg: img });
  }

  play(input) {
    let cpu = this.cpuPlay();
    let game = input.concat(cpu);
    let result = this.calcWin(game);
    let newUser = this.state.user;
    let newCpu = this.state.cpu;
    let newWl = this.state.wl;
    newUser.push(input);
    newCpu.push(cpu);
    newWl.push(result);
    let cpuBtn = cpu.toString();
    let cpuImage;
    let typebtn = typeof cpuBtn;
    console.log("cpu throw", cpu, "player throw", input, "result", result);
    switch (cpuBtn) {
      case "1,0,0":
        cpuImage = "https://i.imgur.com/adraueg.jpg";
        break;
      case "0,1,0":
        cpuImage = "https://i.imgur.com/f85yLy6.jpg";
        break;
      case "0,0,1":
        cpuImage = "https://i.imgur.com/eGRmmHO.jpg";
        break;
      default:
        console.log("switch fn error");
    }
    let gameResult;
    console.log("result is", result);
    switch (result) {
      case 1:
        gameResult = "Lose";
        break;
      case 0:
        gameResult = "Tie";
        break;
      case -1:
        gameResult = "Win";
        break;
      default:
        console.log("switch fn error");
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
        batchComplete: setOver
      };
    });
    console.log("setover", setOver);
    if (setOver) {
      let numGames = this.state.user.length;
      let nullArray = [null];
      let newUser = this.state.user;
      let newCpu = this.state.cpu;
      let newWl = this.state.wl;
      while (newWl.length < 9) {
        newUser.push(nullArray);
        newCpu.push(nullArray);
        newWl.push(null);
      }

      //after postingTo db
      console.log(this.state, "STATE");
      this.props.postRounds(this.state);
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
        };
      });
    }
  }

  cpuPlay() {
    let cpu = [[1, 0, 0], [0, 1, 0], [0, 0, 1]][Math.floor(Math.random() * 3)];
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
      [0, 0, 1, 1, 0, 0] // scissors vs rock
    ];
    console.log("game", game);

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

  render() {
    console.log(this.props, "PROPS");

    //console.log(this.state);
    return (
      <div className="sample">
        <div>
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
              this.userButton("https://i.imgur.com/adraueg.jpg");
            }}
          >
            ROCK
          </button>
          <button
            id="ppaper"
            onClick={() => {
              this.play([0, 1, 0]);
              this.userButton("https://i.imgur.com/f85yLy6.jpg");
            }}
          >
            PAPER
          </button>
          <button
            id="pscissors"
            onClick={() => {
              this.play([0, 0, 1]);
              this.userButton("https://i.imgur.com/eGRmmHO.jpg ");
            }}
          >
            SCISSORS
          </button>
        </div>
        <div className="score">
          SCOREBOARD: <br />
          {this.state.results.map((el, idx) => (
            <div>
              {" "}
              GAME {idx + 1}: {el}{" "}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  dataSet: state.dataSet
});

const mapDispatch = dispatch => ({
  postRounds: rounds => dispatch(postRoundsThunk(rounds)),
  getRounds: () => dispatch(fetchDataThunk())
});

export default connect(
  mapState,
  mapDispatch
)(Home);
