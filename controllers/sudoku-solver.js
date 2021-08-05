class SudokuSolver {

    validate(puzzleString) {
        if(/[^\d.]+/g.test(puzzleString)) return 'Invalid characters in puzzle';
        if(puzzleString.length !== 81) return 'Expected puzzle to be 81 characters long';
        return null;
    }

    checkRowPlacement(puzzleString, row, column, value) {
        const rowString = puzzleString.slice((row - 1) * 9, row * 9);
        if(rowString[column - 1] === value.toString()) return true;
        return !rowString.includes(value.toString());// || (rowString[column - 1] === value.toString());
    }

    checkColPlacement(puzzleString, row, column, value) {
        const columnString = puzzleString
              .split('')
              .filter((d, i) => i % 9 == column - 1)
              .join('');
        if(columnString[row - 1] === value.toString()) return true;
        return !columnString.includes(value.toString());// && !(columnString[row - 1] === value.toString());
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        const rowRegion = (row - 1) - ((row - 1) % 3);
        const columnRegion = (column - 1) - (column - 1) % 3;

        const firstIndex = rowRegion * 9 + columnRegion;

        const regionString = puzzleString.slice(firstIndex, firstIndex + 3) +
              puzzleString.slice(firstIndex + 9, firstIndex + 12) +
              puzzleString.slice(firstIndex + 18, firstIndex + 21);
        if(regionString[3 * ((row - 1) % 3) + ((column - 1) % 3)] === value.toString()) return true;
        return !regionString.includes(value.toString());// && !(regionString[3 * ((row - 1) % 3) + ((column - 1) % 3) ] === value.toString());
    }

    checkPlacement(puzzleString, row, column, value){
            return this.checkRowPlacement(puzzleString, row, column, value) &&
            this.checkColPlacement(puzzleString,row, column, value) &&
            this.checkRegionPlacement(puzzleString, row, column, value);
    }

   solve(puzzleString) {
        for(let i = 0; i < puzzleString.length; i++){
            if(puzzleString[i] === '.'){
                const column = i % 9 + 1;
                const row = parseInt(i / 9) + 1;
                for(let j = 1; j <= 9; j++){
                    if(this.checkPlacement(puzzleString, row, column, j)){
                        const testString = puzzleString.slice(0, i) + j.toString() + puzzleString.slice(i + 1);
                        const solution = this.solve(testString);
                        if(solution !== null) return solution;
                    }
                }
                return null;
            }
        }
        return puzzleString;
    }
}

module.exports = SudokuSolver;
