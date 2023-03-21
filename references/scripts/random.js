function getRandomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomBool() {
    return Math.random() < 0.5;
}

function showRandomBool() {
    document.getElementById("booloutput").innerHTML = getRandomBool();
}

function showRandomInt() {
    document.getElementById("intoutput").innerHTML = getRandomIntFromInterval(document.getElementById("min").value, document.getElementById("max").value)/10;
}