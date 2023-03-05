var fractionArea = document.getElementById("fractionArea");
var percentArea = document.getElementById("percentArea");
var roundedPercentArea = document.getElementById("roundedPercentArea");

var kArea = document.getElementById("kArea");
var nArea = document.getElementById("nArea");

var k;
var n;
var equation1Output;
var equation2Output;

function Calculate() {
    k = kArea.value;
    n = nArea.value;
    equation1Output = Factorial(parseInt(k) + parseInt(n-1))/(Factorial(k) * Factorial(n-1));
    equation2Output = Math.pow(n-k, k);
    Display(equation2Output + "/" + equation1Output, equation2Output/equation1Output);
}

function Factorial(x) {
    if(x == 0) {
        return 1;
    }
    if(x < 0 ) {
        return undefined;
    }
    for(var i = x; --i; ) {
        x *= i;
    }
    return x;
}

function Display(fraction, percent) {
    fractionArea.innerHTML = fraction;
    percentArea.innerHTML = percent * 100 + "%";
    roundedPercentArea.innerHTML = (percent * 100).toFixed(2) + "%";
}