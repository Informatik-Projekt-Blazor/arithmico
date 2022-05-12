import evaluate, { init } from '..';
import createNumberNode from '../create/NumberNode';
import { Context, Options } from '../types';

init();

const testOptions: Options = {
    decimalPlaces: 6,
    decimalSeparator: '.',
    magnitudeThresholdForScientificNotation: 6,
};

const testOptionGermans: Options = {
    decimalPlaces: 6,
    decimalSeparator: ',',
    magnitudeThresholdForScientificNotation: 6,
};

function createTestContext(stack: Context['stack'], options: Options = testOptions): Context {
    return {
        stack,
        options,
    };
}

const germanTextContext = createTestContext([{}], testOptionGermans);

let lastId = 0;

function integrationTest(input: string, expectedOutput: string, context?: Context) {
    test(`integration test #${++lastId}`, () => {
        expect(evaluate(input, context).result).toBe(expectedOutput);
    });
}

function integrationTestThrow(input: string, context?: Context) {
    test(`integration test (throw) #${++lastId}`, () => {
        expect(() => evaluate(input, context)).toThrow();
    });
}

integrationTest('1', '1');
integrationTest('[1,2,3]', '[1, 2, 3]');
integrationTest('1 + 2', '3');
integrationTest('1 - 2', '-1');
integrationTest('-2', '-2');
integrationTest('--2', '2');
integrationTest('2 * 3', '6');
integrationTest('4 / 2', '2');
integrationTest('2 ^ 3', '8');
integrationTest('true & false', 'false');
integrationTest('true & true', 'true');
integrationTest('true | false', 'true');
integrationTest('false | false', 'false');
integrationTest('-true', 'false');
integrationTest('2 < 3 < 4', 'true');
integrationTest('2 < 3 < 3', 'false');
integrationTest('1 < 2 <= 2 = 2 >= 2 > 1', 'true');
integrationTest('2 + 3 * 4 ^ 5 / 32 = 98', 'true');
integrationTest('10 / 2 / 5', '1');
integrationTest('10 - 5 - 3 - 2', '0');
integrationTest('[[1, 2], 3] + [[3, 2], 1]', '[[4, 4], 4]');
integrationTest('[[3,2,1],[1,0,2]]*[[1,2],[0,1],[4,0]]', '[[7, 8], [9, 2]]');
integrationTest('[1,2,3]*[3,2,1]', '10');
integrationTest('[[1,0],[0,1]]*[4,5]', '[4, 5]');
integrationTest('[4,5]*[[1,0],[0,1]]', '[4, 5]');
integrationTest(
    'a + 1',
    '42',
    createTestContext([
        {
            a: createNumberNode(41),
        },
    ]),
);
integrationTest('sin(pi)', '0');
integrationTest('sin(pi/2)', '1');
integrationTest('((x)->x^2)(2)', '4');
integrationTest('((x: number) -> x+1)(3)', '4');
integrationTest('((x: number) -> x) + ((y: number) -> y^2)', '(x: number) → x + x^2');
integrationTest('((x: number) -> x) + ((x: number) -> x^2)', '(x: number) → x + x^2');
integrationTest('nsolve(sin(x)=0) * 1/ pi', '[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]');
integrationTest('nsolve(1/x=0)', '[]');
integrationTest('nsolve(x^3 -4*x^2 +3=0)', '[-0.791288, 1, 3.791288]');
integrationTest('nsolve(x^(34)-1234.32323=0)', '[-1.23289, 1.23289]');
integrationTest('lsolve(2*x+3*y=-6, -3*x-4*y=7)', '[x = 3, y = -4]');
integrationTest('lsolve(x=2, x=3-y)', '[x = 2, y = 1]');
integrationTest('nintegrate((x)->x^2,0,1)', '0.333333');
integrationTest('nintegrate((x)->2*x^2,0,1)', '0.666667');
integrationTest('nintegrate((x)->1/x, -1, 1)', '0');
integrationTest('nderive((x) -> x^2, 2)', '4');
integrationTest('nderive((x) -> x^2, 2, 1)', '4');
integrationTest('nderive((x) -> x^2, 3, 2)', '2');
integrationTest('nderive((x) -> x^2, pi^2, 2)', '2');
integrationTest('log(8,2)', '3');
integrationTest('exp(2)', '7.389056');
integrationTest('ln(exp(2))', '2');
integrationTest('lg(1000)', '3');
integrationTest('e', '2.718282');
integrationTest('min(-1,1,2,3)', '-1');
integrationTest('max(-1,1,2,3,2,1)', '3');
integrationTest('abs(-7)', '7');
integrationTest('abs(7)', '7');
integrationTest('length([1,2,2])', '3');
integrationTest('fraction(1/3)', '1 / 3');
integrationTest('fraction(1/3+1/3)', '2 / 3');
integrationTest('fraction(1/3-1/3)', '0');
integrationTest('1,2+1,3', '2,5', germanTextContext);
integrationTest('((x; y) -> x + y)(1;2)', '3', germanTextContext);
integrationTest('cross([1,2,3],[-7,8,9])', '[-6, -30, 22]');
integrationTest('cross([1,0,0],[0,1,0])', '[0, 0, 1]');
integrationTest('sqrt(4)', '2');
integrationTest('root(8,3)', '2');
integrationTest('fact(0)', '1');
integrationTest('fact(1)', '1');
integrationTest('fact(7)', '5040');

integrationTestThrow('1 + true');
integrationTestThrow('2 + [1,2,3]');
integrationTestThrow('2 ^ 3 ^ 4');
integrationTestThrow('4 * true');
integrationTestThrow('2 * -2');
integrationTestThrow('[[1,2],3]+[1,2,3]');
integrationTestThrow('[1,2]+[1,2,3]');
integrationTestThrow('(-1)^2.1');
integrationTestThrow('lsolve(x+y=1,2*x+2*y=1)');
integrationTestThrow('nintegrate((x)->x&true, -1, 1)');
integrationTestThrow('log(-1, 1)');
integrationTestThrow('log(1, -1)');
integrationTestThrow('log(1, 0)');
integrationTestThrow('log(0, 0)');
integrationTestThrow('ln(-1)');
integrationTestThrow('lg(-1)');
integrationTestThrow('1,2+1,3');
integrationTestThrow('((x; y) -> x + y)(1;2)');
integrationTestThrow('sqrt(-1)');
integrationTestThrow('root(-1, 2)');
integrationTestThrow('root(1, -2)');
