// ---------- Global Variables ----------
const audio_ctx = new window.AudioContext();
const active_oscillators = new Map();
let sustain = false;

// ---------- Frequency Generator ----------
const white_frequencuys = (intonation) => {
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

const black_frequencuys = (intonation) => {
    const range = 10;
    let freqs = [];
	
	if (intonation === "equal") {
        const La_f = 220.0;
        const freq = (n) => La_f * Math.pow(2, (n - 1) / 12);
        
        for (let i = 0; i < range; i++) {
            let adder = i + 1;
            if (i >= 2) adder += 1;
			if (i >= 5) adder += 1;
			if (i >= 7) adder += 1;
			if (i >= 12) adder += 1;
            let n = i + adder;
            freqs.push(freq(n));
        }
	}

	if (intonation === "just") {
		const Do_f = 207.65;
        const ratios = [16/15, 6/5, 45/32, 8/5, 16/9, 21/15];

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
function play_note_start(freq, key_id) {
	if (active_oscillators.has(key_id)) {
		try {
			active_oscillators.get(key_id).stop();
		} catch (e) {}
		active_oscillators.delete(key_id);
	}

	const osc = audio_ctx.createOscillator();
	const gain = audio_ctx.createGain();

	osc.type = "triangle";
	osc.frequency.value = freq;
	gain.gain.setValueAtTime(0.2, audio_ctx.currentTime);

	osc.connect(gain).connect(audio_ctx.destination);
	osc.start();

	active_oscillators.set(key_id, osc);

	const key = document.getElementById(key_id);
	if (key) key.classList.add("active");
}

function play_note_stop(key_id) {
	if (sustain) return;

	const osc = active_oscillators.get(key_id);
	if (osc) {
		try {
			osc.stop();
		} catch (e) {}
		active_oscillators.delete(key_id);
	}

	const key = document.getElementById(key_id);
	if (key) key.classList.remove("active");
}

function stop_all_notes() {
	for (const [key_id, osc] of active_oscillators.entries()) {
		try {
			osc.stop();
		} catch (e) {}
		const key = document.getElementById(key_id);
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
    const white_freqs = white_frequencuys(intonation);
    const black_freqs = black_frequencuys(intonation);
    const select = document.querySelector(`#b_intonation`);
    const label = select.options[select.selectedIndex].textContent.toUpperCase();

    const pattern = "wbwbwwbwbwbwwbwbwwbwbwbw";
    let whiteIndex = 0;
    let blackIndex = 0;
    let keysHTML = "";

    for (let i = 0; i < pattern.length; i++) {
        const keyType = pattern[i];
        if (keyType === 'w' && whiteIndex < white_freqs.length) {
            const freq = white_freqs[whiteIndex];
            const key_id = `key_${intonation}_white_${whiteIndex}`;
            keysHTML += `
                <button
                    class="whitekey"
                    id="${key_id}"
                    onmousedown="play_note_start(${freq}, '${key_id}')"
                    onmouseup="play_note_stop('${key_id}')"
                    onmouseleave="play_note_stop('${key_id}')"
                    ontouchstart="play_note_start(${freq}, '${key_id}')"
                    ontouchend="play_note_stop('${key_id}')"
                >${freq} Hz</button>
            `;
            whiteIndex++;
        } else if (keyType === 'b' && blackIndex < black_freqs.length) {
            const freq = black_freqs[blackIndex];
            const key_id = `key_${intonation}_black_${blackIndex}`;
            keysHTML += `
                <button
                    class="blackkey"
                    id="${key_id}"
                    onmousedown="play_note_start(${freq}, '${key_id}')"
                    onmouseup="play_note_stop('${key_id}')"
                    onmouseleave="play_note_stop('${key_id}')"
                    ontouchstart="play_note_start(${freq}, '${key_id}')"
                    ontouchend="play_note_stop('${key_id}')"
                >${freq} Hz</button>
            `;
            blackIndex++;
        }
    }

    return `
        <div class="keyboard">
            <h2>Afinació: ${label}</h2>
            <div id="keys">
                ${keysHTML}
            </div>
            <br>
            <button onclick="toggle_sustain()" class="sustain_btn">Sustain: ${sustain ? "ON" : "OFF"}</button>
        </div>
    `;
}
