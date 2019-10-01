function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let output = '';

    for (let i=0; i < expr.length; i++) {   // удаление пробелов
        if (expr[i] != ' ') {
            output += expr[i];
        }
    }
    
    let bracketCounter = 0;                 // проверка корректности скобок
    for (let i=0; i < output.length; i++) {
        if (output[i] == '(') {
            bracketCounter++;
        } else if (output[i] == ')') {
            bracketCounter--;
        }
        if (bracketCounter < 0 ) {
            throw("ExpressionError: Brackets must be paired");
        }
    }
    if (bracketCounter != 0) {
        throw("ExpressionError: Brackets must be paired");
    }

    for (let i=0; i < output.length; i++) {     // выборка вложенных скобок
        if (output[i] == ')') {
            for (let j=i; j>=0; j--) {          // проход назад в поиске открывающей скобки
                if (output[j]=='(') {
                    let bracketsResult = calculate(output.substring(j+1, i));                                   // вычисление выражения в скобках
                    output = output.substring(0, j) + bracketsResult + output.substring(i+1, output.length);    // возврат результата в строку
                    i = j;                                                                                      // смещение счетчика назад, т.к. длина строки изменилась
                    break;
                }
            }
        }
    }
    let result = calculate(output);             // вычисление финального выражения без скобок
    return result;
}

function divide (expr) {        // разбиение множителей на делители и деление
    let arr = expr.split('/');
    let division = Number(arr[0]);
    if (arr.length > 1) {
        arr.slice(1).forEach(element => {
            if (Number(element) == 0) {
                throw("TypeError: Division by zero.");
            }
            division /= Number(element);
        });
    }
    return division;
}

function multiply (expr) {      // разбиение вычитаемых на множители и перемножение
    let arr = expr.split('*');
    let power = 1;
    arr.forEach(element => {
        power *= divide(element);
    });
    return power;
}

function substract (expr) {     // разбиение слагаемых на вычитаемые
    let arr = [''];
    let index = 0;
    for (let i=0; i<expr.length; i++) {         
        if (expr[i] == '-') {
            if ((expr[i-1] == '*')||(expr[i-1] == '/')||(expr[i-1] == '-')||(i == 0)) {     // поиск отрицательных чисел
                arr[index] += '-';
            } else {
                index++;
                arr[index] = '';
            }
        } else {
            arr[index] += expr[i];
        }
    }
    let sub = multiply(arr[0]);
    if (arr.length > 1) {
        arr.slice(1).forEach(element => {
            sub -= multiply(element);
        });
    }
    return sub;
}

function calculate(expr) {      // разбиение выражения на слагаемые
    let arr = expr.split('+');
    let summ = 0;
    arr.forEach(element => {
        summ += substract(element);
    });
    return summ;
}

module.exports = {
    expressionCalculator
}