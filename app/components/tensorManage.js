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

function preload() {
  data = loadJSON("data.json");
}

function setup() {
  // Crude interface
  labelP = createP("label");
  lossP = createP("loss");
  rSlider = createSlider(0, 255, 255);
  pSlider = createSlider(0, 255, 0);
  sSlider = createSlider(0, 255, 255);

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

async function train() {
  // This is leaking https://github.com/tensorflow/tfjs/issues/457
  await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1,
    epochs: 2,
    callbacks: {
      onTrainBegin: () => {
        console.log("starting...");
      },
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossP.html("loss: " + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        console.log("finished");
      }
    }
  });
}

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

// async function learnLinear() {
//   const model = tf.sequential();
//   model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
//   model.compile({
//     loss: "meanSquaredError",
//     optimizer: "sgd"
//   });

//   const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
//   const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

//   await model.fit(xs, ys, { epochs: 50 });

//   document.getElementById("output_field").innerText = model.predict(
//     tf.tensor2d([10], [1, 1])
//   );
// }
// learnLinear();
