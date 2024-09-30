let SPACES = " "
let SEPATATOR = `${SPACES}|${SPACES}`
let BORDER_LEFT_RIGHT = ""

const displayGrid = (grid) => {
  console.log("===================================")
  grid.forEach((line, index) => {
    let lineToDisplay = line.map(cell => `${cell ? cell : "0"}`).join(SEPATATOR)
    lineToDisplay = "".concat(BORDER_LEFT_RIGHT, lineToDisplay, BORDER_LEFT_RIGHT)
    console.log(lineToDisplay)
  });
  console.log("===================================")
}

const getHumanReadeableCellName = (lineIndex, colIndex) => {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
  return `${letters[colIndex]}${lineIndex + 1}`
}

const getColumnValues = (colIndex, actualGrid) => {
  return actualGrid.map(line => line[colIndex])
}

const getBlocIndexFromCellPosition = (line, col) => {
  return Math.floor(line/3)*3 + Math.floor(col/3)
}

const get9BlocValuesFromCellPosition = (actualGrid, lineIndex, colIndex) => {
  let blocIndex = getBlocIndexFromCellPosition(lineIndex, colIndex)
  return get9BlocValuesFromBlocIndex(actualGrid, blocIndex)
}

const getCellPositionFromBlocIndexAndOffset = (blocIndex, offset) => {
  return { 
    line: Math.floor(blocIndex/3)*3 + Math.floor(offset/3), 
    col: blocIndex%3*3 + offset%3
  }
}

const getPossibleValuesForCell = (lineIndex, colIndex, actualGrid) => {
  let possiblesValues = [1,2,3,4,5,6,7,8,9]

  let alreadyUsedValOnLine = actualGrid[lineIndex]
  let alreadyUsedValOnCol = getColumnValues(colIndex, actualGrid)
  let alreadyUsedValOn9Bloc = get9BlocValuesFromCellPosition(actualGrid, lineIndex, colIndex)
  let valuesToRemove = [ ...new Set([...alreadyUsedValOnLine, ...alreadyUsedValOnCol, ...alreadyUsedValOn9Bloc])]
  let cellName = getHumanReadeableCellName(lineIndex, colIndex)
  possiblesValues = possiblesValues.filter(val => !valuesToRemove.includes(val))
  return possiblesValues
}

const get9BlocValuesFromBlocIndex = (actualGrid, blocIndex) => {
  let lineStart = Math.floor(blocIndex/3)*3
  let colStart = blocIndex%3*3
  let values = []
  for (let i = lineStart; i < (lineStart+3); i++) {
    for (let j = colStart; j < (colStart+3); j++) {
      values.push(actualGrid[i][j])
    }
  }
  return values
}

const getNearestPossibleValues = (allPossibleValues, type, params) => {
  if(type === "line") return allPossibleValues[params.lineIndex]
  else if(type === "column") return getColumnValues(params.colIndex, allPossibleValues)
  else if(type === "3x3") return get9BlocValuesFromBlocIndex(allPossibleValues, params.blocIndex)
  else {
    throw new Error("invalid type")
  }
}

const getNumberToSetByExclusion = (allPossibleValues, type, params, currentGrid) => {
  let nearestPossibleValues = getNearestPossibleValues(allPossibleValues, type, params)
  let numbersToSet = []

  let count = {};
  for (let i = 0; i < 9; i++) {
    const possibleValuesOfCell = nearestPossibleValues[i];
    for (let k = 0; k < possibleValuesOfCell.length; k++) {
      let val = possibleValuesOfCell[k];
      
      if (count[val] === 2) continue;

      count[val] = (count[val] || 0) + 1;
    }
  }

  const lonelyNumbers = Object.keys(count).filter(key => count[key] === 1).map(Number)

  if(lonelyNumbers.length) {
    lonelyNumbers.forEach(lonelyOne => {
      nearestPossibleValues.forEach((possibleValOfCell, index) => {
        if(possibleValOfCell.includes(lonelyOne)) {
          let position = {}
          if(type === "line") {
            position = { line: params.lineIndex, col: index }
          } else if(type === "column") {
            position = { line: index, col: params.colIndex }
          } else if(type === "3x3") {
            position = getCellPositionFromBlocIndexAndOffset(params.blocIndex, index)
          }

          numbersToSet.push({ numb: lonelyOne, position: position })
        }
      })
    })
  }
  
  return numbersToSet
}


const sudokuIsSolved = (currentGrid) => {
  return currentGrid.every(line => line.every(cell => cell !== 0))
}

const getUpdatedPossibleValuesMappingOnNumberSet = (previousPossiblesValuesMapping, numberToSet) => {
  let { numb, position} = numberToSet
  let { line, col } = position

  let newPossibleValues = JSON.parse(JSON.stringify(previousPossiblesValuesMapping))
  newPossibleValues[line][col] = [];

  //clean on the line
  for (let i = 0; i < 9; i++) {
    newPossibleValues[line][i] = newPossibleValues[line][i].filter(val => val !== numb);
  }

  //clean on the column
  for (let i = 0; i < 9; i++) {
    newPossibleValues[i][col] = newPossibleValues[i][col].filter(val => val !== numb);
  }

  // clean on the 3x3 bloc
  let blocIndex = getBlocIndexFromCellPosition(line, col)
  let lineStart = Math.floor(blocIndex/3)*3
  let colStart = blocIndex%3*3
  for (let i = lineStart; i < (lineStart+3); i++) {
    for (let j = colStart; j < (colStart+3); j++) {
      newPossibleValues[i][j] = newPossibleValues[i][j].filter(val => val !== numb);
    }
  }
  return newPossibleValues
}

module.exports = {
  displayGrid,
  getHumanReadeableCellName,
  getPossibleValuesForCell,
  getColumnValues,
  getBlocIndexFromCellPosition,
  get9BlocValuesFromCellPosition,
  get9BlocValuesFromBlocIndex,
  getNearestPossibleValues,
  getNumberToSetByExclusion,
  sudokuIsSolved,
  getCellPositionFromBlocIndexAndOffset,
  getUpdatedPossibleValuesMappingOnNumberSet,
}