'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

    let solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
            const {
                puzzle,
                coordinate,
                value
            } = req.body;

            const validation = solver.validate(puzzle);
            if (validation) {
                res.json({
                    error: validation
                });
                return;
            }
            if (!puzzle ||
                !coordinate ||
                !value) {
                res.json({
                    error: 'Required field(s) missing'
                });
                return;
            }

            const row = coordinate.slice(0, 1).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
            const column = parseInt(coordinate.slice(1));


            if ((row < 1 || row > 9) || (column < 1 || column > 9)) {
                res.json({
                    error: 'Invalid coordinate'
                });
                return;
            }
            if (value < 1 || value > 9) {
                res.json({
                    error: 'Invalid value'
                });
                return;
            }


            const rowCheck = solver.checkRowPlacement(puzzle, row, column, parseInt(value));
            const colCheck = solver.checkColPlacement(puzzle, row, column, parseInt(value));
            const regionCheck = solver.checkRegionPlacement(puzzle, row, column, parseInt(value));

            const valid = rowCheck && colCheck && regionCheck;


            if (valid)
                res.json({
                    valid: true
                });
            else {
                const conflicts = [];
                if (rowCheck) conflicts.push('row');
                if (colCheck) conflicts.push('column');
                if (regionCheck) conflicts.push('region');
                res.json({
                    valid: false,
                    conflict: conflicts
                });
            }


        });

    app.route('/api/solve')
        .post((req, res) => {
            const puzzleString = req.body.puzzle;
            if (!puzzleString) {
                res.json({
                    error: 'Required field missing'
                });
                return;
            }
            const validation = solver.validate(puzzleString);
            if (validation) {
                res.json({
                    error: validation
                });
                return;
            }
            const solution = solver.solve(puzzleString);
            if (!solution) {
                res.json({
                    error: 'Puzzle cannot be solved'
                });
                return;
            }
            res.json({
                solution: solution
            });
        });
};