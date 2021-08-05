const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
    suite('Handles puzzle string', () => {
        test('Logic handles a correct 81 characters string', (done) => {
            assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), null);
            done();
        });
        test('Logic handles a puzzle string with invalid characters', (done) => {
            assert.equal(solver.validate('1e5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'Invalid characters in puzzle');
            done();
        });

        test('Logic handles a puzzle string that is not 81 characters long', (done) => {
            assert.equal(solver.validate('1..5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'Expected puzzle to be 81 characters long');
            done();
        });
    });
    suite('Handles row placement', () => {
        test('Logic handles a valid row placement', (done) => {
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3), true);
            done();
        });
        test('Logic handles an ivalid row placement', (done) => {
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 1), false);
            done();
        });
    });
    suite('Handles column placement', () => {
        test('Logic handles a valid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3), true);
            done();
        });
        test('Logic handles an ivalid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 7), false);
            done();
        });
    });
    suite('Handles 3x3 grid placement', () => {
        test('Logic handles a valid 3x3 grid placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 3), true);
            done();
        });
        test('Logic handles an ivalid 3x3 grid placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 1, 2, 2), false);
            done();
        });
    });
    suite('Solver', () => {
        test('Valid puzzle string', (done) => {
            assert.isString(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
            done();
        });
        test('Invalid puzzle string', (done) => {
            assert.isNull(solver.solve('1e5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
            done();
        });
        test('Correct solution', (done) => {
            assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
            done();
        });
    });

});