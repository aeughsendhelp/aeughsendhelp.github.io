var convertButton = document.querySelector('.convertbutton');
var URLInput = document.querySelector('.input');

convertButton.addEventListener('click', () => {
    console.log(`URL: ${URLInput.value}`);
    SendURL(URLInput.value);
});

function SendURL(URL) {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
}