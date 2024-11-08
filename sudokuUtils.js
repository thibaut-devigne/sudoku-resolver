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

const findExclusivePair = (nearestPossibleValues) => {
  const pairs = nearestPossibleValues
    .filter(innerArray => innerArray.length === 2)
    .map(innerArray => innerArray.sort((a, b) => a - b).toString());

  const pairCounts = pairs.reduce((acc, pair) => {
    acc[pair] = (acc[pair] || 0) + 1;
    return acc;
  }, {});

  const exclusivePair = Object.entries(pairCounts)
    .filter(([_, count]) => count === 2)
    .map(([pair]) => pair.split(',').map(Number));

  return exclusivePair.length > 0 ? exclusivePair[0] : undefined;
}

const getValuesSeenTwice = (nearestPossibleValues) => {
  const allpossiblesValuesForBloc = nearestPossibleValues.reduce((acc, valuesForCell) => {
    return [...acc, ...valuesForCell]
  }, [])

  let count = allpossiblesValuesForBloc.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {})

  const valuesSeenTwice = Object.entries(count).reduce((acc, [val, count]) => {
    if(count === 2) return [...acc, parseInt(val)]
    return [...acc]
  }, [])

  return valuesSeenTwice
}

const findHiddenPairs = (nearestPossibleValues) => {
  const valuesSeenTwice = getValuesSeenTwice(nearestPossibleValues)
  
  const possiblePairCombinaisons = valuesSeenTwice.flatMap((v, i) => {
    return valuesSeenTwice.slice(i+1).map( w => [v,w] )
  });


  let hiddenPairs = []
  //Is there 2 cell that contain one of these combination ?
  possiblePairCombinaisons.forEach(combi => {
    let matchingCellCount = 0
    let matchingCombi = undefined
    let indexes = []

    for (let i = 0; i < 9; i++) {
      let hasFirstElt = nearestPossibleValues[i].includes(combi[0])
      let hasSecondElt = nearestPossibleValues[i].includes(combi[1])
      if(hasFirstElt && hasSecondElt) {
        matchingCellCount++
        matchingCombi = combi
        indexes.push(i)
      }
    }
    if(matchingCellCount !== 2) return;

    hiddenPairs.push(matchingCombi)
  })

 return hiddenPairs
}

const findExclusiveTriplet = (nearestPossibleValues) => {
  const triplets = nearestPossibleValues
    .filter(innerArray => innerArray.length === 3)
    .map(innerArray => innerArray.sort((a, b) => a - b).toString());

  const tripletCounts = triplets.reduce((acc, pair) => {
    acc[pair] = (acc[pair] || 0) + 1;
    return acc;
  }, {});

  const exclusiveTriplet = Object.entries(tripletCounts)
    .filter(([_, count]) => count === 3)
    .map(([pair]) => pair.split(',').map(Number));

  return exclusiveTriplet.length > 0 ? exclusiveTriplet[0] : undefined;
}

const getNumberToSetByExclusivePair = (allPossibleValues, type, params, currentGrid) => {
  let nearestPossibleValues = getNearestPossibleValues(allPossibleValues, type, params)
  
  let exlusivePair = findExclusivePair(nearestPossibleValues)
  if(!exlusivePair) return []
  
  let numbersToSet = []

  nearestPossibleValues.forEach((possibleValuesOfCell, index) => {
    if(possibleValuesOfCell.length !== 2) return;
      let finalPossibilitiesOfCell = possibleValuesOfCell.filter(possibleVal => !exlusivePair.includes(possibleVal))
      let hasUniquePossibility = finalPossibilitiesOfCell.length === 1
      
      if(hasUniquePossibility) {
        let position = {}
        if(type === "line") {
          position = { line: params.lineIndex, col: index }
        } else if(type === "column") {
          position = { line: index, col: params.colIndex }
        } else if(type === "3x3") {
          position = getCellPositionFromBlocIndexAndOffset(params.blocIndex, index)
        }

        numbersToSet.push({ numb: finalPossibilitiesOfCell[0], position: position })
      }
  })
  
  return numbersToSet
}

const getNumberToSetByHiddenPair = (allPossibleValues, type, params, currentGrid) => {


  let nearestPossibleValues = getNearestPossibleValues(allPossibleValues, type, params)
  let hiddenPairs = findHiddenPairs(nearestPossibleValues)
  if(hiddenPairs.length === 0) return []

  const valuesSeenTwice = getValuesSeenTwice(nearestPossibleValues)

  let numbersToSet = []

  hiddenPairs.forEach(hiddenPair => {
    let indexes = []
    nearestPossibleValues.forEach((candidates, index) => {
      if(candidates.includes(hiddenPair[0]) && candidates.includes(hiddenPair[0])) {
        indexes.push(index)
      }
    })

    //pair found so other possible values are ejected
    let otherValuesOfTheseCell = [
      ...nearestPossibleValues[indexes[0]],
      ...nearestPossibleValues[indexes[1]],
    ].filter(val => val !== hiddenPair[0] && val !== hiddenPair[1])
    
    // 
    otherValuesOfTheseCell.forEach(ejectedValue => {
      if(!valuesSeenTwice.includes(ejectedValue)) return;
      
      for (let i = 0; i < 9; i++) {
        if(indexes.includes(i)) break;

        if(nearestPossibleValues[i].length === 2 && nearestPossibleValues[i].includes(ejectedValue)) {

          let position = {}
          if(type === "line") {
            position = { line: params.lineIndex, col: i }
          } else if(type === "column") {
            position = { line: i, col: params.colIndex }
          } else if(type === "3x3") {
            position = getCellPositionFromBlocIndexAndOffset(params.blocIndex, i)
          }

          numbersToSet.push({ numb: ejectedValue, position: position })

        }
      }
    })
  })

  return numbersToSet
}

const getNumberToSetByExclusiveTriplet = (allPossibleValues, type, params, currentGrid) => {
  let nearestPossibleValues = getNearestPossibleValues(allPossibleValues, type, params)
  
  let exlusiveTriplet = findExclusiveTriplet(nearestPossibleValues)
  if(!exlusiveTriplet) return []
  
  let numbersToSet = []

  nearestPossibleValues.forEach((possibleValuesOfCell, index) => {
    if(possibleValuesOfCell.length !== 3) return;
      let finalPossibilitiesOfCell = possibleValuesOfCell.filter(possibleVal => !exlusiveTriplet.includes(possibleVal))
      let hasUniquePossibility = finalPossibilitiesOfCell.length === 1
      
      if(hasUniquePossibility) {
        let position = {}
        if(type === "line") {
          position = { line: params.lineIndex, col: index }
        } else if(type === "column") {
          position = { line: index, col: params.colIndex }
        } else if(type === "3x3") {
          position = getCellPositionFromBlocIndexAndOffset(params.blocIndex, index)
        }

        numbersToSet.push({ numb: finalPossibilitiesOfCell[0], position: position })
      }
  })
  
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
  getNumberToSetByExclusivePair,
  getNumberToSetByHiddenPair,
  getNumberToSetByExclusiveTriplet,
  findExclusivePair,
  findHiddenPairs,
  findExclusiveTriplet,
  sudokuIsSolved,
  getCellPositionFromBlocIndexAndOffset,
  getUpdatedPossibleValuesMappingOnNumberSet,
}