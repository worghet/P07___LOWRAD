// object
import RadioStation from './RadioStation.js';

// constants

const ID_LOFI247 = 0
const ID_CHILLOFI = 1
const ID_NIGHTWAVE = 2

const STATIONS = [
    new RadioStation(ID_LOFI247, "LOFI 24/7", "http://usa9.fastcast4u.com/proxy/jamz?mp=/1"),
    new RadioStation(ID_CHILLOFI, "CHILLOFI RADIO", "https://azc.rdstream-5677.dez.ovh/listen/chillofi/radio.mp3"),
    new RadioStation(ID_NIGHTWAVE, "NIGHTWAVE", "http://radio.plaza.one/ogg")
]
// use json or som

// independent things
let current_station_button = null;
const radio_audio = new Audio();
const sfx_audio = new Audio();
let radio_selected = false;
let timer_interval;
let flicker_interval;

let remaining_seconds = 0;

// dom access
const station_display = document.getElementById("current-station");
const play_button = document.getElementById("play-btn");
const stop_button = document.getElementById("stop-btn");
const timer_input = document.getElementById("timer-input");
const start_timer_button = document.getElementById("timer-start-btn");
const radio_div = document.getElementById("radio");
const timer_div = document.getElementById("timer");
const cancel_timer_button = document.getElementById("cancel-timer-btn");
const toggle_fullscreen_button = document.getElementById("toggle-fullscreen-btn");
const minutes_spent_display = document.getElementById("minutes-spent-display");

// PROGRAM STARTS HERE

// setup (these will be generated, no point in saving as dom accesses)
document.querySelector("#lofi247-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_LOFI247));
document.querySelector("#chillofi-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_CHILLOFI));
document.querySelector("#nightwave-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_NIGHTWAVE));

// keep these
play_button.addEventListener("click", () => play());
stop_button.addEventListener("click", () => stop());
timer_input.addEventListener("input", () => {
    if (timer_input.value.trim() === "" || Number(timer_input.value) <= 0) {
        start_timer_button.disabled = true;
    } else {
        start_timer_button.disabled = false;
    }
});
start_timer_button.addEventListener("click", () => start_timer());
cancel_timer_button.addEventListener("click", () => cancel_timer());
toggle_fullscreen_button.addEventListener("click", () => toggle_fullscreen());



// let minutes_spent_listening = 0
// setInterval(() => {
//     minutes_spent_listening++;
//     minutes_spent_display.innerHTML = minutes_spent_listening;
//     update_minutes_spent_display()
// }, 1000)


// RADIO FUNCTIONS -----------

function set_station(button, station_id) {

    if (!radio_selected) {
        radio_selected = true;
        play_button.classList.remove("active");
        play_button.disabled = false;
    }

    // if (!audio.paused) {
    //     return
    // }

    const selected_station = STATIONS[station_id];

    // remove active from previous
    if (current_station_button != null) {
        current_station_button.classList.remove("active");
        current_station_button.disabled = false; // re-enable old one
    }

    // set new active + disable + change style
    button.classList.add("active");
    button.disabled = true;
    current_station_button = button;

    // update ui
    station_display.textContent = selected_station.getName();
    // maybe change cat or tenor gif?

    // change audio selected
    radio_audio.src = selected_station.getUrl();
    radio_audio.load()
}

// radio CONTROLS!!!

function play() {
    play_button.disabled = true;
    play_button.classList.add("active");

    stop_button.disabled = false;
    stop_button.classList.remove("active");

    radio_audio.play()
}

function stop() {

    play_button.classList.remove("active");
    play_button.disabled = false;

    stop_button.disabled = true;
    stop_button.classList.add("active");

    radio_audio.pause()
}

// INTERMEDIARY FUNCTIONS ---------

function show_timer() {
    radio_div.style.display = 'none';
    timer_div.style.display = 'flex';
}

function show_radio() {
    radio_div.style.display = 'block';
    timer_div.style.display = 'none';
}

function toggle_fullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen()
    }
    else {
        // Exit fullscreen
        document.exitFullscreen();
    }
}

// TIMER FUNCTIONS ---------------

let flickerState = false; // track current color

function start_timer() {

    const minutes = parseInt(timer_input.value, 10);
    if (isNaN(minutes) || minutes <= 0) return;

    remaining_seconds = minutes * 60;

    // Disable input and start button
    timer_input.disabled = true;
    start_timer_button.disabled = true;

    show_timer();
    update_timer_display();

    // Clear previous intervals if any
    if (timer_interval) clearInterval(timer_interval);
    if (flicker_interval) clearInterval(flicker_interval);

    // Countdown interval
    timer_interval = setInterval(() => {
        remaining_seconds--;
        update_timer_display();

        if (remaining_seconds <= 0) {
            clearInterval(timer_interval);
            startFlicker();
        }
    }, 1000);
}

const timerText = timer_div.querySelector('p'); // the countdown element

// Only run when timer reaches 0
function startFlicker() {
    let flickerState = false;
    flicker_interval = setInterval(() => {
        sfx_end_timer()
        flickerState = !flickerState;
        radio_audio.volume = 0.2
        document.body.style.backgroundColor = flickerState ? "#000000" : "#ffffff";
        timerText.style.color = flickerState ? "#ffffff" : "#000000";
    }, 1000);
}

function cancel_timer() {
    clearInterval(timer_interval);
    clearInterval(flicker_interval);

    document.body.style.backgroundColor = ""; // reset background
    timerText.style.color = "";
    timer_input.disabled = false;
    start_timer_button.disabled = false;

    radio_audio.volume = 1
    show_radio();
    document.exitFullscreen();
}


// helper to update the timer text
function update_timer_display() {
    const mins = String(Math.floor(remaining_seconds / 60)).padStart(2, '0');
    const secs = String(remaining_seconds % 60).padStart(2, '0');
    timer_div.querySelector('p').textContent = `${mins}:${secs}`;
}

//
// function cancel_timer() {
//
//
//     document.exitFullscreen();
//     show_radio()
// }


// SFX

function sfx_end_timer() {
    play_sfx("assets/timer_end.wav")
}

function play_sfx(source) {
    sfx_audio.src = source;
    sfx_audio.load()
    sfx_audio.play()
}


