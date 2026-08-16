let display = document.getElementById("display");

let buttons = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");

let equalsButton = document.getElementById("equals");
let clearButton = document.getElementById("clear");
let backspaceButton = document.getElementById("backspace");

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

}


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