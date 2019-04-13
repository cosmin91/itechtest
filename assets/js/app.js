/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.scss');
require('../css/calculator.scss');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');


// CALCULATOR
function calculatorInit() {
    var operationsArray = [];
    var currentValue = [];
    var stepsEl = $('.summary-container .steps');
    var currentValueEl = $('.summary-container .result');
    var digitsEl = $('.digits button');
    var clearBtn = $('.clear-btn');
    var operatorBtn = $('.right-column button');
    var total = 0;

    function reset() {
        operationsArray = [];
        currentValue = [];
        stepsEl.text('');
        currentValueEl.text('0')
    }
    reset();

    // digits event
    digitsEl.on('click', function () {
        // reset steps 
        stepsEl.text('');

        var value = $(this).data('value');
        if (typeof value !== 'undefined') {
            if (value === '.' && currentValue.indexOf('.') === -1) {
                currentValue.push(',');
            }
            if (!isNaN(value)) {
                currentValue.push(value);
            }
        }
        if(currentValue[0] == 0 && typeof currentValue[1] !== "undefined" && currentValue[1] !== ',') currentValue.shift();
        currentValueEl.text(currentValue.join(''))
    });

    // AC - reset btn
    clearBtn.on('click', function () {
        reset();
    });

    // operator btn event
    operatorBtn.on('click', function () {
        if (currentValue.length === 0) return 0;

        var value = $(this).data('value');
        var currentNumber = Number(currentValue.join('').split(',').join('.'));
        
        if (operationsArray.slice(-1)[0] !== currentNumber && isNaN(operationsArray.slice(-1)[0])) {
            operationsArray.push(currentNumber);
        }


        if (typeof value !== 'undefined' && operationsArray.length !== 0) {
            if (value === '=') {
                // get total when press equal
                if(operationsArray.length > 2) {
                    operationsArray.push(` ${value} `);
                    stepsEl.text(operationsArray.join(''));
                    getTotal(operationsArray);
                    operationsArray = [];
                }
            } else {
                if(operationsArray.length > 2) {
                    getTotal(operationsArray);
                }
                // insert operator value
                if (!isNaN(operationsArray.slice(-1)[0])) {
                    operationsArray.push(` ${value} `);
                } else {
                    operationsArray.pop();
                    operationsArray.push(` ${value} `);
                }
                currentValue = [];
            }
        }
    });

    function getTotal(array) {
        total = eval(array.join('').split('x').join('*').split('÷').join('/').split('=').join(''));
        
        currentValue = [total];
        currentValueEl.text(currentValue.join(total))
    }

}

calculatorInit();