function getRandomIntInclusive(min, max) {
    console.log(min);
    console.log(max)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
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
    document.getElementById("intoutput").innerHTML = getRandomIntInclusive(document.getElementById("min").value, document.getElementById("max").value)/10;
}