import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchDataThunk } from "../reducers/index";
class Tensor extends Component {
  constructor() {
    super();
    this.state = {
      tensor: {
        loss: 0,
        epoch: 0
      }
    };
  }

  componentDidMount() {
    this.props.fetchData();
    let data;
    let model;
    let xs, ys;
    let rSlider, gSlider, bSlider;
    let labelP;
    let lossP;

    let labelList = [
      "red-ish",
      "green-ish",
      "blue-ish",
      "orange-ish",
      "yellow-ish",
      "pink-ish",
      "purple-ish",
      "brown-ish",
      "grey-ish"
    ];

    data = {
      entries: [
        {
          b: 155,
          g: 183,
          label: "green-ish",
          r: 81,
          uid: "EjbbUhVExBSZxtpKfcQ5qzT7jDW2"
        },
        {
          b: 71,
          g: 22,
          label: "pink-ish",
          r: 249,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 33,
          g: 196,
          label: "orange-ish",
          r: 254,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 237,
          g: 147,
          label: "blue-ish",
          r: 170,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 225,
          g: 159,
          label: "blue-ish",
          r: 15,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 166,
          g: 235,
          label: "green-ish",
          r: 79,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 73,
          g: 250,
          label: "green-ish",
          r: 29,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 31,
          g: 245,
          label: "green-ish",
          r: 55,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 235,
          g: 230,
          label: "blue-ish",
          r: 221,
          uid: "CjIU4lEAoiPQXacjMVYSYz9bmpf1"
        },
        {
          b: 52,
          g: 182,
          label: "orange-ish",
          r: 196,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 51,
          g: 72,
          label: "brown-ish",
          r: 123,
          uid: "CjIU4lEAoiPQXacjMVYSYz9bmpf1"
        },
        {
          b: 2,
          g: 10,
          label: "red-ish",
          r: 209,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 160,
          g: 104,
          label: "pink-ish",
          r: 177,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 18,
          g: 207,
          label: "yellow-ish",
          r: 214,
          uid: "CjIU4lEAoiPQXacjMVYSYz9bmpf1"
        },
        {
          b: 24,
          g: 165,
          label: "orange-ish",
          r: 239,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 49,
          g: 155,
          label: "green-ish",
          r: 128,
          uid: "wHjQX3jIO9QdONvjUQDZAJd7e6p2"
        },
        {
          b: 208,
          g: 11,
          label: "purple-ish",
          r: 137,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 125,
          g: 74,
          label: "pink-ish",
          r: 205,
          uid: "wHjQX3jIO9QdONvjUQDZAJd7e6p2"
        },
        {
          b: 65,
          g: 126,
          label: "brown-ish",
          r: 179,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 162,
          g: 83,
          label: "blue-ish",
          r: 76,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 63,
          g: 231,
          label: "green-ish",
          r: 116,
          uid: "wHjQX3jIO9QdONvjUQDZAJd7e6p2"
        },
        {
          b: 195,
          g: 16,
          label: "purple-ish",
          r: 141,
          uid: "fpqsSD6CvNNFQmRp9sJDdI1QJm32"
        },
        {
          b: 161,
          g: 210,
          label: "green-ish",
          r: 149,
          uid: "CjIU4lEAoiPQXacjMVYSYz9bmpf1"
        }
      ]
    };

    function setup() {
      // Crude interface

      let colors = [];
      let labels = [];
      for (let record of data.entries) {
        let col = [record.r / 255, record.g / 255, record.b / 255];
        colors.push(col);
        labels.push(labelList.indexOf(record.label));
      }

      xs = tf.tensor2d(colors);
      let labelsTensor = tf.tensor1d(labels, "int32");

      ys = tf.oneHot(labelsTensor, 9).cast("float32");
      labelsTensor.dispose();

      model = tf.sequential();
      const hidden = tf.layers.dense({
        units: 16,
        inputShape: [3],
        activation: "sigmoid"
      });
      const output = tf.layers.dense({
        units: 9,
        activation: "softmax"
      });
      model.add(hidden);
      model.add(output);

      const LEARNING_RATE = 0.25;
      const optimizer = tf.train.sgd(LEARNING_RATE);

      model.compile({
        optimizer: optimizer,
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
      });

      train();
    }

    const train = async () => {
      await model.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 200,
        callbacks: {
          onTrainBegin: () => {
            console.log("starting...");
          },
          onEpochEnd: (epoch, logs) => {
            console.log(epoch);
            console.log(logs.loss.toFixed(5));
            this.setState({ tensor: { loss: logs.loss.toFixed(5), epoch } });
            console.log(this.state, "STAAAATE");
          },
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            console.log("finished");
          }
        }
      });
    };

    function draw() {
      tf.tidy(() => {
        let r, p, s;
        const input = tf.tensor2d([[r, p, s]]);
        let results = model.predict(input);
        let argMax = results.argMax(1);
        let index = argMax.dataSync()[0];
        let label = labelList[index];
        labelP.html(label);
      });
    }
    setup();
    // train();
  }
  render() {
    let cpuOutput = Math.random(1);
    console.log(this.props, "PROPS HERE");
    return (
      <div>
        <h1>CPU:</h1>
        <button>ROCK</button>
        <button>PAPER</button>
        <button>SCISSORS</button>
        <p>CPU OUTPUT: {this.state && this.state.tensor.epoch} </p>
        <p>CPU OUTPUT: {this.state && this.state.tensor.loss} </p>
        <h1>USER INPUT:</h1>
        <button>ROCK</button>
        <button>PAPER</button>
        <button>SCISSORS</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entries: state.entries
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchDataThunk());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tensor);
