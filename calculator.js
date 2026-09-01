let display = document.getElementById("display");

let buttons = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");

let equalsButton = document.getElementById("equals");
let clearButton = document.getElementById("clear");
let backspaceButton = document.getElementById("backspace");
let percentButton = document.getElementById("percent");

let expression = "";


// FORMAT NUMBERS
function formatExpression(value) {

    return value.replace(/\d+(\.\d*)?/g, function(number) {

        let parts = number.split(".");

        let wholeNumber = parts[0];
        let decimalPart = parts[1];

        wholeNumber = wholeNumber.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

        if (decimalPart !== undefined) {
            return wholeNumber + "." + decimalPart;
        }

        return wholeNumber;
    });
}


// UPDATE DISPLAY
function updateDisplay() {

    display.value = formatExpression(expression);

    // Wait until the display has updated
    // before moving to the newest part
    requestAnimationFrame(function() {
        display.scrollLeft = display.scrollWidth;
    });

}

// DISPLAY HORIZONTAL SWIPE

let startX = 0;
let startScrollLeft = 0;

display.addEventListener("touchstart", function(event) {

    startX = event.touches[0].clientX;
    startScrollLeft = display.scrollLeft;

}, { passive: true });


display.addEventListener("touchmove", function(event) {

    let currentX = event.touches[0].clientX;
    let distance = currentX - startX;

    display.scrollLeft = startScrollLeft - distance;

}, { passive: true });


// NUMBER BUTTONS
buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        let number = button.textContent;


        // DECIMAL
        if (number === ".") {

            let parts = expression.split(/[+\-−×÷]/);

            let currentNumber = parts[parts.length - 1];

            if (currentNumber.includes(".")) {
                return;
            }

            if (expression === "") {
                expression = "0.";
                updateDisplay();
                return;
            }

            if (
                expression === "0" ||
                expression.endsWith("+") ||
                expression.endsWith("−") ||
                expression.endsWith("×") ||
                expression.endsWith("÷")
            ) {

                expression += "0.";

                updateDisplay();
                return;
            }
        }


        // REMOVE STARTING ZERO
        if (expression === "0") {

            expression = number;

        } else {

            expression += number;

        }

        updateDisplay();

    });

});


// OPERATOR BUTTONS
operators.forEach(function(button) {

    button.addEventListener("click", function() {

        let operator = button.textContent;


        // Don't allow operator first
        if (expression === "") {
            return;
        }


        // Don't allow two operators together
        let lastCharacter =
            expression[expression.length - 1];

        if ("+−×÷".includes(lastCharacter)) {
            return;
        }


        expression += operator;

        updateDisplay();

    });

});


// EQUALS
equalsButton.addEventListener("click", function() {

    if (expression === "") {
        return;
    }

    try {

        let calculation = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");


        let answer = Function(
            "return " + calculation
        )();


        if (!Number.isFinite(answer)) {

            display.value = "Error";

            expression = "";

            return;
        }


        expression = String(answer);

        updateDisplay();


    } catch (error) {

        display.value = "Error";

        expression = "";

    }

});


// CLEAR
clearButton.addEventListener("click", function() {

    expression = "";

    display.value = "0";

});


// BACKSPACE
backspaceButton.addEventListener("click", function() {

    expression = expression.slice(0, -1);

    if (expression === "") {

        display.value = "0";

    } else {

        updateDisplay();

    }

});

// PERCENT BUTTON
// PERCENT BUTTON
percentButton.addEventListener("click", function() {

    if (expression === "") {
        return;
    }

    let parts = expression.split(/[+−×÷]/);

    let percent = Number(parts[parts.length - 1]);

    // Only one number
    if (parts.length === 1) {

        expression = String(percent / 100);

        updateDisplay();

        return;
    }

    let firstNumber = Number(parts[parts.length - 2]);

    let operator = expression[expression.length - parts[parts.length - 1].length - 1];

    let answer;

    // Multiplication and division use the percentage as a decimal
    if (operator === "×") {

        answer = percent / 100;

    } else if (operator === "÷") {

        answer = percent / 100;

    // Addition and subtraction calculate a percentage of the first number
    } else if (operator === "+" || operator === "−") {

        answer = firstNumber * percent / 100;

    }

    // Replace the percentage number with the calculated value
    expression = expression.slice(
        0,
        expression.lastIndexOf(parts[parts.length - 1])
    );

    expression += String(answer);

    updateDisplay();

});

const modeButton = document.getElementById("modeButton");
const modeMenu = document.getElementById("modeMenu");

modeButton.addEventListener("click", function () {
    modeMenu.classList.toggle("show");
});

const basicMode = document.getElementById("basicMode");
const scientificMode = document.getElementById("scientificMode");
const mathNotesMode = document.getElementById("mathNotesMode");

basicMode.addEventListener("click", function () {

    basicMode.classList.add("active");
    scientificMode.classList.remove("active");
    mathNotesMode.classList.remove("active");

    basicCalculator.classList.remove("hide-basic");
    scientificCalculator.classList.remove("show-scientific");
	modeMenu.classList.remove("show");
	
});


scientificMode.addEventListener("click", function () {

    basicMode.classList.remove("active");
    scientificMode.classList.add("active");
    mathNotesMode.classList.remove("active");

    basicCalculator.classList.add("hide-basic");
    scientificCalculator.classList.add("show-scientific");
	modeMenu.classList.remove("show");
});

mathNotesMode.addEventListener("click", function () {

    basicMode.classList.remove("active");
    scientificMode.classList.remove("active");
    mathNotesMode.classList.add("active");

});

const basicCalculator = document.getElementById("basicCalculator");
const scientificCalculator = document.getElementById("scientificCalculator");

// SCIENTIFIC NUMBER BUTTONS

let scientificNumbers = document.querySelectorAll(".scientific-number");

scientificNumbers.forEach(function(button) {

    button.addEventListener("click", function() {

        let number = button.textContent;

        // DECIMAL BUTTON
        if (number === ".") {

            let parts = expression.split(/[+\-−×÷]/);

            let currentNumber = parts[parts.length - 1];

            if (currentNumber.includes(".")) {
                return;
            }

            if (
                expression === "" ||
                expression === "0" ||
                expression.endsWith("+") ||
                expression.endsWith("−") ||
                expression.endsWith("×") ||
                expression.endsWith("÷")
            ) {

                expression += "0.";

                updateDisplay();
                return;
            }
        }

        // REMOVE STARTING ZERO
        if (expression === "0") {

            expression = number;

        } else {

            expression += number;

        }

        updateDisplay();

    });

});

// SCIENTIFIC OPERATOR BUTTONS

let scientificOperators = document.querySelectorAll(".scientific-operator");

scientificOperators.forEach(function(button) {

    button.addEventListener("click", function() {

        let operator = button.textContent;

        // Don't allow an operator first
        if (expression === "") {
            return;
        }

        // Don't allow two operators together
        let lastCharacter = expression[expression.length - 1];

        if ("+−×÷".includes(lastCharacter)) {
            return;
        }

        expression += operator;

        updateDisplay();

    });

});

// SCIENTIFIC EQUALS BUTTON

let scientificEquals = document.querySelector(".scientific-equals");

scientificEquals.addEventListener("click", function() {

    if (expression === "") {
        return;
    }

    try {

        let calculation = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        let answer = Function(
            "return " + calculation
        )();

        if (!Number.isFinite(answer)) {

            display.value = "Error";
            expression = "";

            return;
        }

        expression = String(answer);

        updateDisplay();

    } catch (error) {

        display.value = "Error";
        expression = "";

    }

});

// SCIENTIFIC CLEAR BUTTON

let scientificClear = document.querySelector(".scientific-clear");

scientificClear.addEventListener("click", function() {

    expression = "";

    display.value = "0";

});

// SCIENTIFIC BACKSPACE BUTTON

let scientificBackspace = document.querySelector(".scientific-backspace");

scientificBackspace.addEventListener("click", function() {

    expression = expression.slice(0, -1);

    if (expression === "") {
        display.value = "0";
    } else {
        updateDisplay();
    }

});

// SQUARE ROOT

let squareRootButton = document.getElementById("squareRoot");

squareRootButton.addEventListener("click", function() {

    if (expression === "") {
        return;
    }

    let number = Number(expression);

    if (number < 0) {
        display.value = "Error";
        expression = "";
        return;
    }

    let answer = Math.sqrt(number);

    expression = String(answer);

    updateDisplay();

});

// SQUARE

let squareButton = document.getElementById("square");

squareButton.addEventListener("click", function() {

    if (expression === "") {
        return;
    }

    let number = Number(expression);

    let answer = number ** 2;

    expression = String(answer);

    updateDisplay();

});
