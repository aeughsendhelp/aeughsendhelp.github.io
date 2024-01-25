function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max - min + 1))
}

function getRandomBool() {
    return Math.random() >= 0.5;
}

function showRandomBool() {
    document.getElementById("booloutput").innerHTML = getRandomBool();
}

function showRandomInt() {
    var random = new Random.Random();
    alert("Random value from 1 to 100: " + random.integer(1, 100));
    // document.getElementById("intoutput").innerHTML = generateRandomInteger(document.getElementById("min").value, document.getElementById("max").value)/10;
}