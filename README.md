# sudoku-resolver
Node js app to solve sudoku.

It's base on the four main method : 
- inclusion method
- exclusion method
- exclusive pair
- exclusive triplet

And some more complex rules like :
- X-Wings
- Y-Wings
- Simple coloration

## Usage
To solve your grid, go to index.js and change the initialGrid. \
Empty cell in your grid should be set to 0. \
Then you can run :
```shell
npm run start
```
You can also run test
```shell
npm run test
npm run test:watch
```

## Disclaimer
I know the code is not pretty and I don't think it's performant but it works quite ok and I had fun doing it. 


## Improvement
- [x] inclusion method
- [x] exclusion method
- [] exclusive pair
- [] exclusive triplet
- [x] X-wing
