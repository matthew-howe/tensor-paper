const { db } = require("./server/db");
const { green, red } = require("chalk");

const Dataset = require("./server/db/models/dataset");
const Round = require("./server/db/models/round");

const data = [
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
];

const round = [
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 },
  { userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1 }
];

const seed = async () => {
  try {
    await db.sync({ force: true });
    await Promise.all(
      data.map(d => {
        return Dataset.create(d);
      })
    );
    await Promise.all(
      round.map(elem => {
        return Round.create(elem);
      })
    );
    console.log(green("Seeding success!"));
    db.close();
  } catch (err) {
    console.error(red("Oh dear!!!!! Something went awry :/!"));
    console.error(err);
    db.close();
  }
};

seed();
