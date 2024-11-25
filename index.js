const { exemple } = require("./exempleGrid")
const { displayGrid } = require("./sudokuUtils.js")
const { 
  generateHTMLFullPageContent, 
  getSolvedGrid,
  generateHTMLResolutionSteps
} = require("./getSolvedGrid.js")

// const initialGrid = [
//   [3,5,0,0,0,0,0,4,0],
//   [0,0,7,2,0,1,0,0,6],
//   [0,0,0,7,0,3,9,0,0],
//   [0,0,0,0,1,0,5,0,0],
//   [0,0,0,8,0,7,4,1,2],
//   [0,0,0,4,0,0,0,0,8],
//   [9,0,5,0,0,0,6,8,0],
//   [0,0,4,9,0,6,1,2,0],
//   [0,0,2,0,0,0,0,0,0]
// ]

const initialGrid = exemple.find(aGrid => aGrid.reference === "expert_2616").statement
// const initialGrid = exemple[0].statement


// console.log("++++++ INITIAL GRID ++++++ ")
// displayGrid(initialGrid)

// const solvedGrid = getSolvedGrid(initialGrid)
// console.log("++++++ FINAL GRID ++++++ ")
// displayGrid(solvedGrid)


generateHTMLResolutionSteps(initialGrid)