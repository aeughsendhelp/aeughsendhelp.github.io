var coll = document.getElementsByClassName("collapsiblevertical");

for(var i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
		var content = this.nextElementSibling;

		if(content.classList.contains("contentOpen")) {
			content.classList.remove("contentOpen");
		} else {
			content.classList.add("contentOpen");
		}
		console.log(content.style.maxHeight);
	});
}