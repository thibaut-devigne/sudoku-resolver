const { 
  get9BlocValuesFromCellPosition,
  get9BlocValuesFromBlocIndex,
  getBlocIndexFromCellPosition,
  sudokuIsSolved,
  getCellPositionFromBlocIndexAndOffset,
  getCandidatesGridOnNumberSet,
  getCandidatesToRemoveByExclusivePair,
  getNumberToSetByExclusivePair,
  getNumberToSetByHiddenPair,
  getNumberToSetByExclusiveTriplet,
  findExclusivePair,
  findHiddenPairs,
  findExclusiveTriplet,
  gridsAreEquals
} = require("./sudokuUtils.js")

const { 
  getSolvedGrid,
} = require("./getSolvedGrid.js")

const { exemple } = require("./exempleGrid")

describe("", () => {
  
  const grid = [
    [1,1,1, 2,2,2, 3,3,3],
    [1,1,1, 2,2,2, 3,3,3],
    [1,1,1, 2,2,2, 3,3,3],
    [4,4,4, 5,5,5, 6,6,6],
    [4,4,4, 5,5,5, 6,6,6],
    [4,4,4, 5,5,5, 6,6,6],
    [7,7,7, 8,8,8, 9,9,9],
    [7,7,7, 8,8,8, 9,9,9],
    [7,7,7, 8,8,8, 9,9,9],
  ]
  test('It should get all number in the 3x3 bloc around the provided position', () => {
    expect(get9BlocValuesFromCellPosition(grid, 0, 0)).toEqual([1,1,1,1,1,1,1,1,1])
    expect(get9BlocValuesFromCellPosition(grid, 1, 4)).toEqual([2,2,2,2,2,2,2,2,2])
    expect(get9BlocValuesFromCellPosition(grid, 8, 8)).toEqual([9,9,9,9,9,9,9,9,9])
  });  

  test('It should get all number in the 3x3 bloc inside bloc (with bloc index)', () => {
    expect(get9BlocValuesFromBlocIndex(grid, 0)).toEqual([1,1,1,1,1,1,1,1,1])
    expect(get9BlocValuesFromBlocIndex(grid, 2)).toEqual([3,3,3,3,3,3,3,3,3])
    expect(get9BlocValuesFromBlocIndex(grid, 4)).toEqual([5,5,5,5,5,5,5,5,5])
    expect(get9BlocValuesFromBlocIndex(grid, 8)).toEqual([9,9,9,9,9,9,9,9,9])
  });

  test("It should get bloc index from cell possition", () => {
    expect(getBlocIndexFromCellPosition(0,0)).toBe(0)
    expect(getBlocIndexFromCellPosition(0,3)).toBe(1)
    expect(getBlocIndexFromCellPosition(0,8)).toBe(2)
    expect(getBlocIndexFromCellPosition(8,0)).toBe(6)

    //Central bloc 
    expect(getBlocIndexFromCellPosition(3,3)).toBe(4)
    expect(getBlocIndexFromCellPosition(3,4)).toBe(4)
    expect(getBlocIndexFromCellPosition(3,5)).toBe(4)
    expect(getBlocIndexFromCellPosition(4,3)).toBe(4)
    expect(getBlocIndexFromCellPosition(4,4)).toBe(4)
    expect(getBlocIndexFromCellPosition(4,5)).toBe(4)
    expect(getBlocIndexFromCellPosition(5,3)).toBe(4)
    expect(getBlocIndexFromCellPosition(5,4)).toBe(4)
    expect(getBlocIndexFromCellPosition(5,5)).toBe(4)
  })

  test("It should check if sudoku is solved or not (solved mean no 0)", () => {
    let grid1 = [
      [1,2,3,4,5,6,7,8,9],
      [4,5,6,7,8,9,1,2,3],
      [7,8,9,1,2,3,4,5,6],
      [2,3,4,5,6,7,8,9,1],
      [5,6,7,8,9,1,2,3,4],
      [8,9,1,2,3,4,5,6,7],
      [3,4,5,6,7,8,9,1,2],
      [6,7,8,9,1,2,3,4,5],
      [9,1,2,3,4,5,6,7,8],
    ]
    expect(sudokuIsSolved(grid1)).toBe(true)

    let grid2 = JSON.parse(JSON.stringify(grid1))
    grid2[0][0] = 0
    expect(sudokuIsSolved(grid2)).toBe(false)
  })

  test("It should check cell position with bloc index and offset", () => {
    // value of offset for the central bloc
    // [
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,1,2,0,0,0],
    //   [0,0,0,3,4,5,0,0,0],
    //   [0,0,0,6,7,8,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0],
    // ]
    expect(getCellPositionFromBlocIndexAndOffset(4,7)).toEqual({line: 5, col: 4})
  })

  test("It should check cell position with bloc index and offset", () => {
    // inside the first bloc, there is only one place where the 2 could be set
    // the algo detect this infos, and 2 is set on position (line:0, col:1)
    // so now 2 cannot be a possible value on position (line:0, col:7) nor on position (line:8, col:1)
    const previousCandidatesGrid = [
      [[],[2,3],[],[],[],[],[],[1,2,9],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[3,5],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[2,5],[],[],[],[],[],[],[]],
    ]
    
    expect(previousCandidatesGrid[0][1]).toEqual([2,3])
    expect(previousCandidatesGrid[0][7]).toEqual([1,2,9])
    expect(previousCandidatesGrid[8][1]).toEqual([2,5])
    
    let numberToSetParams = { numb: 2, position: { line: 0, col: 1 } }
    let result = getCandidatesGridOnNumberSet(previousCandidatesGrid, numberToSetParams)

    expect(result[0][1]).toEqual([])
    expect(result[0][7]).toEqual([1,9])
    expect(result[8][1]).toEqual([5])
    
    //SIMILAR EXEMPLE
    // on the first line, there is only one place where the 3 could be set
    // the algo detect this infos, and 3 is set on position (line:0, col:1)
    // so now 3 cannot be a possible value on position (line:2, col:2)
    const previousCandidatesGrid2 = [
      [[],[2,3],[],[],[5,6],[],[],[1,9],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[3,5],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]
    
    expect(previousCandidatesGrid2[0][1]).toEqual([2,3])
    expect(previousCandidatesGrid2[2][2]).toEqual([3,5])
    
    let numberToSetParams2 = { numb: 3, position: { line: 0, col: 1 } }
    let result2 = getCandidatesGridOnNumberSet(previousCandidatesGrid2, numberToSetParams2)


    expect(result2[0][1]).toEqual([])
    expect(result2[2][2]).toEqual([5])
  })

  test("It should find exclusive pair", () => {
    //EXCLUSIVE PAIR
    let nearestPossibleValues = [ [6,7],[],[3,7],[],[],[],[],[],[3,7]]
    let result = findExclusivePair(nearestPossibleValues)
    expect(result).toEqual([3,7])

    //NO PAIR
    let nearestPossibleValues2 = [ [6,7],[],[4,7],[],[],[],[],[],[3,7]]
    let result2 = findExclusivePair(nearestPossibleValues2)
    expect(result2).toBeUndefined()

    //TRIPLET BUT STILL NO PAIR
    let nearestPossibleValues3 = [ [6,7],[],[3,7],[],[3,7],[],[],[],[3,7]]
    let result3 = findExclusivePair(nearestPossibleValues3)
    expect(result3).toBeUndefined()
  })

  test("It should check exclusive pair and extract number to set in grid", () => {
    const previousCandidatesGrid = [
      [[],[],[],[6,7],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[3,7],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[3,7],[],[],[],[],[]],
    ]

    let params = { colIndex: 3 }
    let result = getNumberToSetByExclusivePair(previousCandidatesGrid, "column", params)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(6)
    expect(result[0].position.line).toEqual(0)
    expect(result[0].position.col).toEqual(3)
  })

  test("It should find hidden pair inside an array", () => {
    
    const previousCandidatesGrid = [[3,5,8,9],[],[3,5,8,9],[7,9],[3,9],[1,3,4,7],[1,3,4,5],[],[3,5,9]]

    let result = findHiddenPairs(previousCandidatesGrid)
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual([1,4])
  })

  test("It should check hidden pair and extract number to set in grid", () => {
    //in this exemple 1 and 4 can only be in 2 positions, that means, that 7 can't be in that position
    //so it's somewhere else, so it can be set in (line: 6, col: 3)
    const previousCandidatesGrid = [
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[3,5,8,9],[],[3,5,8,9],[7,9],[3,9],[1,3,4,7],[1,3,4,5],[],[3,5,9]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]

    let params = { lineIndex: 6 }
    let result = getNumberToSetByHiddenPair(previousCandidatesGrid, "line", params)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(7)
    expect(result[0].position.line).toEqual(6)
    expect(result[0].position.col).toEqual(3)
  })

  test("It should find exclusive triplet inside an array", () => {
    const previousCandidatesGrid = [[2,6,8],[],[2,6,8],[],[6,8,9],[2,6,8],[],[],[]]

    let result = findExclusiveTriplet(previousCandidatesGrid)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual([2,6,8])
  })

  test("It should check exclusive triplet and extract number to set in grid - PERFECT TRIPLET", () => {
    const previousCandidatesGrid = [
      [[],[],[],[],[],[],[2,6,8],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[2,6,8],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[6,8,9],[],[]],
      [[],[],[],[],[],[],[2,6,8],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]

    let params = { colIndex: 6 }
    let result = getNumberToSetByExclusiveTriplet(previousCandidatesGrid, "column", params)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(9)
    expect(result[0].position.line).toEqual(4)
    expect(result[0].position.col).toEqual(6)
  })

  test("It should check that 2 grid are equals", () => {
    const gridA = [
      [0,0,0,0,0,5,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ]

    const gridB = [
      [0,0,0,0,0,5,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ]
    expect(gridsAreEquals(gridA, gridB)).toBe(true)
  })

  test("It should detect when 2 grid are not equal", () => {
    const gridA = [
      [0,0,0,0,0,0,5,5,5],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ]

    const gridB = [
      [1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ]
    expect(gridsAreEquals(gridA, gridB)).toBe(false)
  })

  test("It should remove candidate when exclusive pair let you (case with line)", () => {
    const allPossibleValues = [
      [[],[2,4],[],[4,7],[],[],[2,4],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]
    const type = "line"
    const params = { "lineIndex": 0 }
    const result = getCandidatesToRemoveByExclusivePair(allPossibleValues, type, params)

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual({index: 3, numb: 4})
  })

  test("It should remove candidate when exclusive pair let you (case with column)", () => {
    const allPossibleValues = [
      [[],[3,5],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[3,5],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[5,7],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]
    const type = "column"
    const params = { "colIndex": 1 }
    const result = getCandidatesToRemoveByExclusivePair(allPossibleValues, type, params)

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual({index: 7, numb: 5})
  })

  test("It should remove candidate when exclusive pair let you (case with 3x3 bloc)", () => {
    const allPossibleValues = [
      [[],   [6,8],[],   [],[],[],[],[],[]],
      [[],   [],   [6,8],[],[],[],[],[],[]],
      [[2,8],[],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
      [[],   [],   [],   [],[],[],[],[],[]],
    ]
    const type = "3x3"
    const params = { "blocIndex": 0 }
    const result = getCandidatesToRemoveByExclusivePair(allPossibleValues, type, params)

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual({index: 6, numb: 8})
  })

  test("It should remove several candidates when several exclusive sive pair are found", () => {
    const allPossibleValues = [
      [[],[2,4],[3,5],[4,7],[],[3,5],[2,4],[],[5,9]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
      [[],[],[],[],[],[],[],[],[]],
    ]
    const type = "line"
    const params = { "lineIndex": 0 }
    const result = getCandidatesToRemoveByExclusivePair(allPossibleValues, type, params)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual([ { numb: 4, index: 3 }, { numb: 5, index: 8 } ])
  })
})

describe("Full grid resolution", () => {
  test("case with easy grid", () => {
    const easyGrid = exemple[0]
    const { statement, solved } = easyGrid
    const calculatedSolvedGrid = getSolvedGrid(statement)

    expect(gridsAreEquals(calculatedSolvedGrid, solved)).toBe(true)
  })

  test("case with medium grid", () => {
    const mediumGrid = exemple[1]
    const { statement, solved } = mediumGrid
    const calculatedSolvedGrid = getSolvedGrid(statement)

    expect(gridsAreEquals(calculatedSolvedGrid, solved)).toBe(true)
  })

  // test("case with hard grid", () => {
  //   const hardGrid = exemple[2]
  //   const { statement, solved } = hardGrid
  //   const calculatedSolvedGrid = getSolvedGrid(statement)

  //   expect(gridsAreEquals(calculatedSolvedGrid, solved)).toBe(true)
  // })

  // test("case with expert grid", () => {
  //   const expertGrid = exemple[3]
  //   const { statement, solved } = expertGrid
  //   const calculatedSolvedGrid = getSolvedGrid(statement)

  //   expect(gridsAreEquals(calculatedSolvedGrid, solved)).toBe(true)
  // })
})