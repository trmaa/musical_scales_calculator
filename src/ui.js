//import "utilities.js";

let dark_mode = true;
const style = () => {
	return dark_mode ? "src/dark_mode.css" : "src/light_mode.css"; 
}

const app = () => `

<link rel="stylesheet" href="${style()}">

<header id="header">
	<h1>ESCALES</h1>
	<button id="b_dark_mode">Dark Mode ${dark_mode ? "ON" : "OFF"}</button>
</header>

<button id="b_add_scale">+</button>

<div id="grid"></div>

<div id="keyboard"></div>

`;

function toggle_dark_mode() {
    dark_mode = !dark_mode;
    app_init();
}

function app_init() {
	document.body.innerHTML = app();

	let b_dark_mode = document.body.querySelector("#b_dark_mode");
	b_dark_mode.addEventListener("click", toggle_dark_mode);
}
