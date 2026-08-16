let display = document.getElementById("display");
let buttons = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");
let equalsButton = document.getElementById("equals");
let clearButton = document.getElementById("clear");
let backspaceButton = document.getElementById("backspace");

let expression = "";


// FORMAT NUMBERS FOR THE DISPLAY
function formatExpression(value) {

    return value.replace(/\d+(\.\d*)?/g, function(number) {

        let parts = number.split(".");
        let wholeNumber = parts[0];
        let decimalPart = parts[1];

        // Add commas to whole numbers
        wholeNumber = wholeNumber.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

        // Keep decimal part
        if (decimalPart !== undefined) {
            return wholeNumber + "." + decimalPart;
        }

        return wholeNumber;

    });

}


// UPDATE THE DISPLAY
function updateDisplay() {

    display.value = formatExpression(expression);

    // Move display to the far right
    display.scrollLeft = display.scrollWidth;

}


// NUMBER BUTTONS
buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        let number = button.textContent;


        // DECIMAL BUTTON
        if (number === ".") {

            // Get the current number
            let parts = expression.split(/[+\-−×÷]/);
            let currentNumber = parts[parts.length - 1];


            // Don't allow two decimal points
            if (currentNumber.includes(".")) {
                return;
            }


            // If starting from zero
            if (expression === "0") {

                expression = "0.";

                updateDisplay();

                return;
            }

        }


        // Remove starting zero
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
        let lastCharacter = expression[expression.length - 1];

        if ("+−×÷".includes(lastCharacter)) {
            return;
        }


        expression += operator;

        updateDisplay();

    });

});


// EQUALS BUTTON
equalsButton.addEventListener("click", function() {

    if (expression === "") {
        return;
    }


    try {

        // Convert calculator symbols
        let calculation = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");


        // Calculate the expression
        let answer = Function("return " + calculation)();


        // Check for invalid answers
        if (!Number.isFinite(answer)) {

            display.value = "Error";
            expression = "";

            return;
        }


        // Save answer
        expression = String(answer);

        updateDisplay();


    } catch (error) {

        display.value = "Error";
        expression = "";

    }

});


// CLEAR BUTTON
clearButton.addEventListener("click", function() {

    expression = "";

    display.value = "0";

});


// BACKSPACE BUTTON
backspaceButton.addEventListener("click", function() {

    expression = expression.slice(0, -1);


    if (expression === "") {

        display.value = "0";

    } else {

        updateDisplay();

    }

});