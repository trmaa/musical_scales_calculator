//import "utilities.js";

let dark_mode = false;
const style = () => {
	return dark_mode ? "src/dark_mode.css" : "src/light_mode.css"; 
}

const app = () => `

<link rel="stylesheet" href="${style()}">

<header id="header">
	<h1>ESCALES</h1>
	<button id="b_dark_mode">Dark Mode ${dark_mode ? "ON" : "OFF"}</button>
</header>

<span>
	<label>Afinació: </label>
	<select id="b_intonation">
		<option value="equal">Igual</option>
		<option value="just">Justa</option>
	</select>
	<button id="b_add_scale">+</button>
	<button id="b_remove" class="b_remove">Netejar</button>
</span>

<br></br>

<div id="keyboards"></div>

`;

function toggle_dark_mode() {
    dark_mode = !dark_mode;
    app_init();
}

function app_init() {
	document.body.innerHTML = app();

	let b_dark_mode = document.body.querySelector("#b_dark_mode");
	b_dark_mode.addEventListener("click", toggle_dark_mode);

	let b_remove = document.body.querySelector("#b_remove");
    b_remove.addEventListener("click", () => {
        let keyboards = document.body.querySelector("#keyboards");
        keyboards.innerHTML = "";
    });

	let keyboards = document.body.querySelector("#keyboards");
	let b_add_scale = document.body.querySelector("#b_add_scale");
    b_add_scale.addEventListener("click", () => {
        let afination = document.body.querySelector("#b_intonation").value;
        keyboards.innerHTML += keyboard_add(afination);
    });
}
