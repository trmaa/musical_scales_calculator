//import "utilities.js";
//import "keyboard.js";

let dark_mode = false;
const style = () => {
	return dark_mode ? "src/dark_mode.css" : "src/light_mode.css"; 
}

const app = () => `

<link rel="stylesheet" href="${style()}">

<header id="header">
	<h1>ESCALES <img class="icon" src="bin/icons/music-note.png"></h1>
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

	if (dark_mode) window.alert("darkmode is still in development");

    app_init();
}

function app_init() {
	document.body.innerHTML = app();

	let b_dark_mode = document.body.querySelector("#b_dark_mode");
	b_dark_mode.addEventListener("click", toggle_dark_mode);

	let b_remove = document.body.querySelector("#b_remove");
    b_remove.addEventListener("click", () => {
    	app_init(); 
    });

	let keyboards = document.body.querySelector("#keyboards");
	let b_add_scale = document.body.querySelector("#b_add_scale");

	let keyboards_body = [];
	let keyboards_controller = `
		<div class="controller">
			<button class="b_up">^</button>
			<button class="b_down">v</button>
			<button class="b_del b_remove">Borrar</button>
		</div>
	`;

	function render_keyboards() {
		keyboards.innerHTML = "";
		keyboards_body.forEach((item, i) => {
			let container = document.createElement("div");
			container.className = "keyb_contr";
			container.innerHTML = item + keyboards_controller;

			container.querySelector(".b_up").addEventListener("click", () => {
				if (i > 0) {
					[keyboards_body[i], keyboards_body[i - 1]] = [keyboards_body[i - 1], keyboards_body[i]];
					render_keyboards();
				}
			});

			container.querySelector(".b_down").addEventListener("click", () => {
				if (i < keyboards_body.length - 1) {
					[keyboards_body[i], keyboards_body[i + 1]] = [keyboards_body[i + 1], keyboards_body[i]];
					render_keyboards();
				}
			});

			container.querySelector(".b_del").addEventListener("click", () => {
				keyboards_body.splice(i, 1);
				render_keyboards();
			});

			keyboards.appendChild(container);
		});
	}

	b_add_scale.addEventListener("click", () => {
		let afination = document.body.querySelector("#b_intonation").value;
		keyboards_body.push(keyboard_add(afination));
		render_keyboards();
	});
}
