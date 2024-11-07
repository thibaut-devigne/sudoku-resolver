const { exemple } = require("./exempleGrid")
const {
  displayGrid,
  getPossibleValuesForCell,
  getNumberToSetByExclusion,
  getNumberToSetByExclusivePair,
  sudokuIsSolved,
  getUpdatedPossibleValuesMappingOnNumberSet,
} = require("./sudokuUtils.js")

const initialGrid = [
  [3,5,0,0,0,0,0,4,0],
  [0,0,7,2,0,1,0,0,6],
  [0,0,0,7,0,3,9,0,0],
  [0,0,0,0,1,0,5,0,0],
  [0,0,0,8,0,7,4,1,2],
  [0,0,0,4,0,0,0,0,8],
  [9,0,5,0,0,0,6,8,0],
  [0,0,4,9,0,6,1,2,0],
  [0,0,2,0,0,0,0,0,0]
]

// const initialGrid = exemple.find(aGrid => aGrid.reference === "expert_2616").statement
console.log("++++++ INITIAL GRID ++++++ ")
displayGrid(initialGrid)

const getSolvedGrid = (grid) => {
  let currentGrid = JSON.parse(JSON.stringify(grid))
  let n = 0;
  let possiblesValuesMapping = Array(9).fill().map(a => Array(9).fill().map(b => []))
  let valueWasAddedByInclusion = false

  while (n < 100) {
    valueWasAddedByInclusion = false
    // console.log("Loop n°", n, " =========")
    n++;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        
        let isNotFoundYet = currentGrid[i][j] === 0
        if(isNotFoundYet) {
          let possiblesValues = getPossibleValuesForCell(i, j, currentGrid)
          possiblesValuesMapping[i][j] = possiblesValues

          //INCLUSION METHOD
          if(possiblesValues.length === 1) {
            currentGrid[i][j] = possiblesValues[0]
            possiblesValuesMapping[i][j] = []
            valueWasAddedByInclusion = true
          } 
        }
      } 
    }

    
    
    if(!valueWasAddedByInclusion) {
      let numberToSet = []

      let exclusionTypes = ["line", "column", "3x3"]
      exclusionTypes.forEach(type => {
        numberToSet = []
        for (let index = 0; index < 9; index++) {
          let mappingType_ParamsName = { 
            line: "lineIndex",
            column: "colIndex",
            "3x3": "blocIndex",
          }
          let params = { [mappingType_ParamsName[type]]: index }
          //EXCLUSION METHOD
          let numberToSetForThisItem = getNumberToSetByExclusion(possiblesValuesMapping, type, params, currentGrid)
          numberToSet = [ ...numberToSet, ...numberToSetForThisItem]
          
          //EXCLUSIVE PAIR METHOD
          let numberToSetFromExclusivePair = getNumberToSetByExclusivePair(possiblesValuesMapping, type, params)
          numberToSet = [ ...numberToSet, ...numberToSetFromExclusivePair]
        }
        
        numberToSet.forEach(numberToSetParams => {
          let { numb, position } = numberToSetParams
          let { line, col } = position
          currentGrid[line][col] = numb
          possiblesValuesMapping = getUpdatedPossibleValuesMappingOnNumberSet(possiblesValuesMapping, numberToSetParams)
        })
      })
    }

    if(sudokuIsSolved(currentGrid)) {
      break;
    }
  }

  return currentGrid
}

const solvedGrid = getSolvedGrid(initialGrid)
console.log("++++++ FINAL GRID ++++++ ")
displayGrid(solvedGrid)