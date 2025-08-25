// IMPORTS ----------------------------------


import RadioStation from './RadioStation.js';


// CONSTANTS --------------------------------


// Station IDs.
const ID_LOFI247 = 0
const ID_CHILLOFI = 1
const ID_NIGHTWAVE = 2

// Station objects.
const STATIONS = [
    new RadioStation(ID_LOFI247, "LOFI 24/7", "http://usa9.fastcast4u.com/proxy/jamz?mp=/1"),
    new RadioStation(ID_CHILLOFI, "CHILLOFI RADIO", "https://azc.rdstream-5677.dez.ovh/listen/chillofi/radio.mp3"),
    new RadioStation(ID_NIGHTWAVE, "NIGHTWAVE", "http://radio.plaza.one/ogg")
]

// Audio objects.
const radio_audio = new Audio();
const sfx_audio = new Audio();

// UI management variables.
let current_station_button = null;
let radio_selected = false;

// Timer management variables.
let remaining_seconds = 0;
let timer_interval;
let ring_interval;

// DOM-Access Variables:

// "Pages" (just divs I hide/show).
const radio_div = document.getElementById("radio");
const timer_div = document.getElementById("timer");

// Radio "Page".
const station_display = document.getElementById("current-station");
const play_button = document.getElementById("play-btn");
const stop_button = document.getElementById("stop-btn");
const timer_input = document.getElementById("timer-input");
const start_timer_button = document.getElementById("timer-start-btn");

// Timer "Page".
const timer_text = timer_div.querySelector('p');
const cancel_timer_button = document.getElementById("cancel-timer-btn");
const toggle_fullscreen_button = document.getElementById("toggle-fullscreen-btn");


// PROGRAM --------------------------------


// Setup event listeners for radio buttons.
document.querySelector("#lofi247-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_LOFI247));
document.querySelector("#chillofi-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_CHILLOFI));
document.querySelector("#nightwave-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_NIGHTWAVE));

// Add more event listeners for radio control.
play_button.addEventListener("click", () => play());
stop_button.addEventListener("click", () => stop());

// Event listener for time timer time input.
timer_input.addEventListener("input", () => {

    // Disable the start timer button empty,less than 0, or is not an integer.

    if (timer_input.value.trim() === "" || Number(timer_input.value) <= 0 ||  !Number.isInteger(Number(timer_input.value))) {
        start_timer_button.disabled = true;
    } else {
        start_timer_button.disabled = false;
    }

});

// Event listener to start the timer.
start_timer_button.addEventListener("click", () => start_timer());

// Event listeners for timer "page" controls.
cancel_timer_button.addEventListener("click", () => cancel_timer());
toggle_fullscreen_button.addEventListener("click", () => toggle_fullscreen());


// RADIO FUNCTIONS -----------


// Changes the selected station.
function set_station(button, station_id) {

    // If nothing is selected, update the variable and enable the "play" button.
    if (!radio_selected) {
        radio_selected = true;
        play_button.classList.remove("active");
        play_button.disabled = false;
    }

    // Remove the "pressed" (disabled) state from previously selected station.
    if (current_station_button != null) {
        current_station_button.classList.remove("active");
        current_station_button.disabled = false;
    }

    // Set this station button to look "pressed" (disabled) + update button variable.
    button.classList.add("active");
    button.disabled = true;
    current_station_button = button; // chatGPT didn't think of this beautiful solution >:)

    // Note down the station object.
    const selected_station = STATIONS[station_id];

    // Update selected station display (not important) + change audio stream (important).
    station_display.textContent = selected_station.getName();
    radio_audio.src = selected_station.getUrl();
    radio_audio.load()
}

// Begins playing audio.
function play() {

    // Set play button as "disabled".
    play_button.disabled = true;
    play_button.classList.add("active");

    // Enable the "stop" button.
    stop_button.disabled = false;
    stop_button.classList.remove("active");

    // Play / Resume audio.
    radio_audio.play()

}

// Stops playing audio.
function stop() {

    // Set stop button as "disabled".
    stop_button.disabled = true;
    stop_button.classList.add("active");

    // Enable the "play" button.
    play_button.classList.remove("active")
    play_button.disabled = false;

    // Stop / pause audio.
    radio_audio.pause()

}


// INTERMEDIARY FUNCTIONS ---------


// Switches to the timer "page".
function show_timer() {
    radio_div.style.display = 'none';
    timer_div.style.display = 'flex';
}

// Switches to the radio "page".
function show_radio() {
    radio_div.style.display = 'block';
    timer_div.style.display = 'none';
}

// Enters / Exits fullscreen.
function toggle_fullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    }
    else {
        document.exitFullscreen();
    }
}


// TIMER FUNCTIONS ---------------


// Starts the timer.
function start_timer() {

    // Read the amount of minutes requested.
    const minutes = parseInt(timer_input.value, 10);

    // Convert to seconds.
    remaining_seconds = minutes * 60;

    // Switch to timer "page".
    show_timer();

    // Update the timer text.
    update_timer_display();

    // Clear previous intervals if any (don't think i need this tbh).
    if (timer_interval) clearInterval(timer_interval);
    if (ring_interval) clearInterval(ring_interval);

    // Set up the timer interval (runs every 1 second).
    timer_interval = setInterval(() => {

        // Subtract a second.
        remaining_seconds--;

        // Update the display.
        update_timer_display();

        // Check if the remaining seconds has reached 0.
        if (remaining_seconds === 0) {

            // Stop counting down.
            clearInterval(timer_interval);

            // Notify that timer finished.
            ring_timer();

        }
    }, 1000);
}

// Updates the timer display (thank you grade 9 comp sci teacher for the python exercises on this very subject).
function update_timer_display() {

    // Calculate minutes.
    const mins = String(Math.floor(remaining_seconds / 60)).padStart(2, '0');

    // Calculate seconds.
    const secs = String(remaining_seconds % 60).padStart(2, '0');

    // Update the display.
    timer_text.textContent = mins + ":" + secs;
}

// Notify that the timer has reached 0 (flicker + sound).
function ring_timer() {

    // Quiet the radio volume.
    radio_audio.volume = 0.2

    // Local variable to track flicker.
    let flickerState = false;

    // Set up ring interval.
    ring_interval = setInterval(() => {

        // Play ring sound effect.
        sfx_end_timer()

        // Change the flicker state.
        flickerState = !flickerState;

        // Change the screen background colour.
        document.body.style.backgroundColor = flickerState ? "#000000" : "#ffffff";

        // Change the text colour to contrast screen colour.
        timer_text.style.color = flickerState ? "#ffffff" : "#000000";

    }, 1000);
}

// Cancel the timer + go back to radio.
function cancel_timer() {

    // Clear intervals.
    clearInterval(timer_interval);
    clearInterval(ring_interval);

    // Reset background / timer text colour.
    document.body.style.backgroundColor = "";
    timer_text.style.color = "";

    // Reset radio volume.
    radio_audio.volume = 1

    // Switch to radio "page".
    show_radio();

    // Exit fullscreen.
    document.exitFullscreen();
}


// SFX FUNCTIONS ----------------


// Base function for other sounds.
function play_sfx(source) {
    sfx_audio.src = source;
    sfx_audio.load()
    sfx_audio.play()
}

// Specifically plays the timer ring.
function sfx_end_timer() {
    play_sfx("assets/timer_end.wav")
}