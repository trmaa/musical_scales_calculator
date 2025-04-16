// ---------- Global Variables ----------
const audio_ctx = new window.AudioContext();
const active_oscillators = new Map();
let sustain = false;

// ---------- Frequency Generator ----------
const frequencys = (intonation) => {
	const range = 15;
	let freqs = [];

	if (intonation === "equal") {
		const La_f = 220.0;
		const freq = (n) => La_f * Math.pow(2, (n - 1) / 12);

		for (let i = 0; i < range; i++) {
			let adder = i;
			if (i >= 3) adder -= 1;
			if (i >= 7) adder -= 1;
			if (i >= 10) adder -= 1;
			if (i >= 14) adder -= 1;
			const n = i + adder;
			freqs.push(freq(n));
		}
	}

	if (intonation === "just") {
		const Do_f = 207.65;
		const ratios = [1 / 1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2 / 1];

		for (let i = 0; i < range + 1; i++) {
			if (i < ratios.length - 1) {
				freqs.push(Do_f * ratios[i]);
			}
			if (i >= ratios.length) {
				freqs.push(Do_f * ratios[i - ratios.length] * 2);
			}
		}
	}

	return freqs.map(freq => +freq.toFixed(2));
};

// ---------- Audio Playback ----------
function play_note_start(freq, keyId) {
	if (active_oscillators.has(keyId)) {
		try {
			active_oscillators.get(keyId).stop();
		} catch (e) {}
		active_oscillators.delete(keyId);
	}

	const osc = audio_ctx.createOscillator();
	const gain = audio_ctx.createGain();

	osc.type = "triangle";
	osc.frequency.value = freq;
	gain.gain.setValueAtTime(0.2, audio_ctx.currentTime);

	osc.connect(gain).connect(audio_ctx.destination);
	osc.start();

	active_oscillators.set(keyId, osc);

	const key = document.getElementById(keyId);
	if (key) key.classList.add("active");
}

function play_note_stop(keyId) {
	if (sustain) return;

	const osc = active_oscillators.get(keyId);
	if (osc) {
		try {
			osc.stop();
		} catch (e) {}
		active_oscillators.delete(keyId);
	}

	const key = document.getElementById(keyId);
	if (key) key.classList.remove("active");
}

function stop_all_notes() {
	for (const [keyId, osc] of active_oscillators.entries()) {
		try {
			osc.stop();
		} catch (e) {}
		const key = document.getElementById(keyId);
		if (key) key.classList.remove("active");
	}
	active_oscillators.clear();
}

function toggle_sustain() {
	sustain = !sustain;
	const btns = document.getElementsByClassName("sustain_btn");
	for (let i = 0; i < btns.length; i++) {	
		btns[i].textContent = `Sustain: ${sustain ? "ON" : "OFF"}`;
	}

	if (!sustain) {
		stop_all_notes();
	}
}

// ---------- Keyboard Renderer ----------
function keyboard_add(intonation) {
	const freqs = frequencys(intonation);
	const select = document.querySelector(`#b_intonation`);
	const label = select.options[select.selectedIndex].textContent.toUpperCase();

	return `
		<div class="keyboard">
			<h2>Afinació: ${label}</h2>
			<div id="keys">
				${freqs.map((freq, i) => {
					const keyId = `key_${intonation}_${i}`;
					return `
						<button
							class="whitekey"
							id="${keyId}"
							onmousedown="play_note_start(${freq}, '${keyId}')"
							onmouseup="play_note_stop('${keyId}')"
							onmouseleave="play_note_stop('${keyId}')"
							ontouchstart="play_note_start(${freq}, '${keyId}')"
							ontouchend="play_note_stop('${keyId}')"
						>${freq} Hz</button>
					`;
				}).join("")}
			</div>
			<br>
			<button onclick="toggle_sustain()" class="sustain_btn">Sustain: ${sustain ? "ON" : "OFF"}</button>
		</div>
	`;
}
