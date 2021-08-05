const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solve a puzzle', () => {
        test('With valid puzzle string', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                    done();
                });
        });
        test('With missing puzzle string', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });
        test('With invalid characters', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '1e5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });
        test('With incorrect length', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                })
        });
        test('With puzzle that cannot be solved', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                })
        });
    });

    suite('Check puzzle placement', () => {
        test('With all the fields', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });
        test('With single placement conflict', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '9'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.equal(res.body.conflict.length, 1);
                    assert.equal(res.body.conflict[0], "column");
                    done();
                });
        });
        test('With multiple placement conflict', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '6'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.equal(res.body.conflict.length, 2);
                    assert.include(res.body.conflict, 'region');
                    assert.include(res.body.conflict, 'column');
                    done();
                });
        });
        test('With all placement conflict', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3);
                    assert.include(res.body.conflict, 'region');
                    assert.include(res.body.conflict, 'column');
                    assert.include(res.body.conflict, 'row');
                    done();
                });
        });
        test('With missing required fields', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });
        test('With invalid characters', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1e5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });
        test('With invalid length', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1..5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
        test('With invalid placement cordinates', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'Z2',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });
        test('With invalid value', done => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: 'e'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });

});