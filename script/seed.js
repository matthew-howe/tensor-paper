'use strict'

const db = require('../server/db')
const Round = require('../server/db/models/round')

const round = [
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1},
  {userThrow: [0, 0, 1], cpuThrow: [1, 0, 0], cpuWinStatus: 1}
]

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
  await Promise.all(
    round.map(elem => {
      return Round.create(elem)
    })
  )

  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
