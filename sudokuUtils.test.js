const { 
  get9BlocValuesFromCellPosition,
  get9BlocValuesFromBlocIndex,
  getBlocIndexFromCellPosition,
  sudokuIsSolved,
  getCellPositionFromBlocIndexAndOffset,
  getUpdatedPossibleValuesMappingOnNumberSet,
  getNumberToSetByExclusivePair,
  getNumberToSetByHiddenPair,
  getNumberToSetByExclusiveTriplet,
  findExclusivePair,
  findHiddenPairs,
  findExclusiveTriplet
} = require("./sudokuUtils.js")

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
    const previousPossiblesValuesMapping = [
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
    
    expect(previousPossiblesValuesMapping[0][1]).toEqual([2,3])
    expect(previousPossiblesValuesMapping[0][7]).toEqual([1,2,9])
    expect(previousPossiblesValuesMapping[8][1]).toEqual([2,5])
    
    let numberToSetParams = { numb: 2, position: { line: 0, col: 1 } }
    let result = getUpdatedPossibleValuesMappingOnNumberSet(previousPossiblesValuesMapping, numberToSetParams)

    expect(result[0][1]).toEqual([])
    expect(result[0][7]).toEqual([1,9])
    expect(result[8][1]).toEqual([5])
    
    //SIMILAR EXEMPLE
    // on the first line, there is only one place where the 3 could be set
    // the algo detect this infos, and 3 is set on position (line:0, col:1)
    // so now 3 cannot be a possible value on position (line:2, col:2)
    const previousPossiblesValuesMapping2 = [
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
    
    expect(previousPossiblesValuesMapping2[0][1]).toEqual([2,3])
    expect(previousPossiblesValuesMapping2[2][2]).toEqual([3,5])
    
    let numberToSetParams2 = { numb: 3, position: { line: 0, col: 1 } }
    let result2 = getUpdatedPossibleValuesMappingOnNumberSet(previousPossiblesValuesMapping2, numberToSetParams2)


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
    const previousPossiblesValuesMapping = [
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
    let result = getNumberToSetByExclusivePair(previousPossiblesValuesMapping, "column", params)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(6)
    expect(result[0].position.line).toEqual(0)
    expect(result[0].position.col).toEqual(3)
  })

  test("It should find hidden pair inside an array", () => {
    
    const previousPossiblesValuesMapping = [[3,5,8,9],[],[3,5,8,9],[7,9],[3,9],[1,3,4,7],[1,3,4,5],[],[3,5,9]]

    let result = findHiddenPairs(previousPossiblesValuesMapping)
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toEqual([1,4])
  })

  test("It should check hidden pair and extract number to set in grid", () => {
    //in this exemple 1 and 4 can only be in 2 positions, that means, that 7 can't be in that position
    //so it's somewhere else, so it can be set in (line: 6, col: 3)
    const previousPossiblesValuesMapping = [
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
    let result = getNumberToSetByHiddenPair(previousPossiblesValuesMapping, "line", params)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(7)
    expect(result[0].position.line).toEqual(6)
    expect(result[0].position.col).toEqual(3)
  })

  test("It should find exclusive triplet inside an array", () => {
    const previousPossiblesValuesMapping = [[2,6,8],[],[2,6,8],[],[6,8,9],[2,6,8],[],[],[]]

    let result = findExclusiveTriplet(previousPossiblesValuesMapping)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual([2,6,8])
  })

  test("It should check exclusive triplet and extract number to set in grid - PERFECT TRIPLET", () => {
    const previousPossiblesValuesMapping = [
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
    let result = getNumberToSetByExclusiveTriplet(previousPossiblesValuesMapping, "column", params)
    console.log("result === ", result)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    expect(result[0].numb).toEqual(9)
    expect(result[0].position.line).toEqual(4)
    expect(result[0].position.col).toEqual(6)
  })
})

