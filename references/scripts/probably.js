var fractionArea = document.getElementById("fractionArea");
var simplifiedFractionArea = document.getElementById("simplifiedFractionArea");
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
    
function Reduce(numerator,denominator){
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
  }
  
  reduce(2,4);
  // [1,2]
  
  reduce(13427,3413358);
  // [463,117702]
  

function Display(fraction, percent) {
    fractionArea.innerHTML = fraction;
    simplifiedFractionArea.innerHTML = Reduce(equation2Output,equation1Output)[0] + "/" + Reduce(equation2Output,equation1Output)[1];
    percentArea.innerHTML = percent * 100 + "%";
    roundedPercentArea.innerHTML = (percent * 100).toFixed(2) + "%";
}