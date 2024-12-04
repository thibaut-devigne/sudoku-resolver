const fs = require('node:fs');

const {
  getPossibleValuesForCell,
  getNumberToSetByExclusion,
  getCandidatesToRemoveByExclusivePair,
  getNumberToSetByExclusivePair,
  getNumberToSetByHiddenPair,
  getNumberToSetByExclusiveTriplet,
  getPositionFromTypeAndIndex,
  getCandidatesGridOnCandidateRemoval,
  sudokuIsSolved,
  getCandidatesGridOnNumberSet,
  displayGrid,
  getXWings,
  getCandidatesToRemoveByXWings,
  getCandidatesToRemoveByXYWings,
  getHTMLFullPageContent,
  getHtmlGridContent,
  getHTMLContent,
} = require("./sudokuUtils.js")

const nineCellsTypes = ["line", "column", "3x3"]

const mappingType_ParamsName = { 
  line: "lineIndex",
  column: "colIndex",
  "3x3": "blocIndex",
}

const getNextGridFullInfos = (grid, loopNumber) => {
  let nextGrid = JSON.parse(JSON.stringify(grid))
  let candidatesGrid = Array(9).fill().map(a => Array(9).fill().map(b => []))

  //////////
  //CHECK POSSIBILITIES/CANDIDATES
  //////////
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let isNotFoundYet = nextGrid[i][j] === 0
      if(isNotFoundYet) {
        let possiblesValues = getPossibleValuesForCell(i, j, nextGrid)
        candidatesGrid[i][j] = possiblesValues
      }
    }
  }

  let nbAddedByInclusion = false
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
    
      let alreadyFound = nextGrid[i][j] !== 0
      if(alreadyFound) continue;

      //INCLUSION METHOD
      let possiblesValues = candidatesGrid[i][j]
      let hasSeveralCandidates = possiblesValues.length > 1
      if(hasSeveralCandidates) continue;

      nextGrid[i][j] = possiblesValues[0]
      nbAddedByInclusion = true
      let numberToSet = { 
        numb: possiblesValues[0],
        position: { line: i, col: j }
      }
      candidatesGrid = getCandidatesGridOnNumberSet(candidatesGrid, numberToSet)              
      //need to add hidden singles here
      //https://sudoku.com/sudoku-rules/hidden-singles/
    } 
  }

  if(nbAddedByInclusion) return { nextGrid, candidatesGrid }

  nineCellsTypes.forEach(type => {
    for (let index = 0; index < 9; index++) {
      let params = { [mappingType_ParamsName[type]]: index }

      let candidatesToRemove = getCandidatesToRemoveByExclusivePair(candidatesGrid, type, params)
      candidatesToRemove.forEach(({ numb, index: cellIndex}) => {
        let position = getPositionFromTypeAndIndex(type, params, cellIndex)
        candidatesGrid = getCandidatesGridOnCandidateRemoval(candidatesGrid, { numb, position })
      })
    }
  })
  
  //X-WING
  let candidatesToRemoveByXWing = getCandidatesToRemoveByXWings(candidatesGrid)
  candidatesToRemoveByXWing.forEach((numbAndPosition) => {
    candidatesGrid = getCandidatesGridOnCandidateRemoval(candidatesGrid, numbAndPosition)
  })

  // //XY-WING
  // let candidatesToRemoveByXYWing = getCandidatesToRemoveByXYWings(candidatesGrid)
  // candidatesToRemoveByXYWing.forEach((numbAndPosition) => {
  //   candidatesGrid = getCandidatesGridOnCandidateRemoval(candidatesGrid, numbAndPosition)
  // })


  //////////
  //RESOLUTION
  //////////
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      
      let isNotFoundYet = nextGrid[i][j] === 0
      if(isNotFoundYet) {
        //INCLUSION METHOD
        let possiblesValues = candidatesGrid[i][j]
        if(possiblesValues.length === 1) {
          nextGrid[i][j] = possiblesValues[0]
          let numberToSet = { 
            numb: possiblesValues[0], 
            position: { line: i, col: j }
          }
          candidatesGrid = getCandidatesGridOnNumberSet(candidatesGrid, numberToSet)              
        }
        //need to add hidden singles here
        //https://sudoku.com/sudoku-rules/hidden-singles/
      }
    } 
  }

  let numberToSet = []

  nineCellsTypes.forEach(type => {
    numberToSet = []
    for (let index = 0; index < 9; index++) {
      let params = { [mappingType_ParamsName[type]]: index }
      //EXCLUSION METHOD
      let numberToSetForThisItem = getNumberToSetByExclusion(candidatesGrid, type, params, nextGrid)
      numberToSet = [ ...numberToSet, ...numberToSetForThisItem]
      
      //EXCLUSIVE PAIR METHOD
      let numberToSetFromExclusivePair = getNumberToSetByExclusivePair(candidatesGrid, type, params)
      numberToSet = [ ...numberToSet, ...numberToSetFromExclusivePair]

      //HIDDEN PAIR METHOD
      let numberToSetFromHiddenPair = getNumberToSetByHiddenPair(candidatesGrid, type, params)
      numberToSet = [ ...numberToSet, ...numberToSetFromHiddenPair]

      //EXCLUSIVE TRIPLET METHOD
      let numberToSetFromExclusiveTriplet = getNumberToSetByExclusiveTriplet(candidatesGrid, type, params)
      numberToSet = [ ...numberToSet, ...numberToSetFromExclusiveTriplet]
    }
    
    numberToSet.forEach(numberToSetParams => {
      let { numb, position } = numberToSetParams
      let { line, col } = position
      nextGrid[line][col] = numb
      candidatesGrid = getCandidatesGridOnNumberSet(candidatesGrid, numberToSetParams)
    })
  })

  return { nextGrid, candidatesGrid }
}

const getNextGrid = (grid, loopNumber) => {
  let { nextGrid } = getNextGridFullInfos(grid, loopNumber)
  return nextGrid
}

const getSolvedGrid = (grid) => {
  let currentGrid = JSON.parse(JSON.stringify(grid))
  let n = 0;

  while (n < 100) {
    // console.log("Loop n°", n, " =========")
    n++;
    currentGrid = getNextGrid(currentGrid, n)

    if(sudokuIsSolved(currentGrid)) {
      break;
    }
  }

  return currentGrid
}

const generateHTMLResolutionSteps = (initialGrid) => {
  let currentGrid = JSON.parse(JSON.stringify(initialGrid))
  let n = 0;
  let htmlResolutionStepsBody = ""

  while (n < 100) {
    console.log("Loop n°", n, " =========")
    n++;
    let { nextGrid, candidatesGrid } = getNextGridFullInfos(currentGrid, n)
    currentGrid = nextGrid
    htmlResolutionStepsBody = htmlResolutionStepsBody.concat(getHtmlGridContent(nextGrid, candidatesGrid))
    htmlResolutionStepsBody = htmlResolutionStepsBody.concat(`<p>Step ${n}</p>`)

    if(sudokuIsSolved(currentGrid)) {
      break;
    }
  }

  let content = getHTMLContent(htmlResolutionStepsBody)

  fs.writeFile('index.html', content, err => {
    if (err) {
      console.error(err);
    }
  });
  return currentGrid
}


const generateHTMLFullPageContent = (grid) => {
  let content = getHTMLFullPageContent(grid)

  fs.writeFile('index.html', content, err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  getSolvedGrid,
  generateHTMLFullPageContent,
  generateHTMLResolutionSteps,
}