// object
import RadioStation from './RadioStation.js';

// constants

const ID_FLUXFM = 0
const ID_CHILLOFI = 1
const ID_VAPORWAVE = 2

const STATIONS = [
    new RadioStation(ID_FLUXFM, "FLUX FM (not working?)", "https://fluxfm.streamabc.net/flx-chillhop-mp3-128-8581707..."),
    new RadioStation(ID_CHILLOFI, "CHILLOFI", "https://azc.rdstream-5677.dez.ovh/listen/chillofi/radio.mp3"),
    new RadioStation(ID_VAPORWAVE, "VAPORWAVE", "http://radio.plaza.one/ogg")
]
// use json or som

// independent things
let current_station_button = null;
const audio = new Audio();
let radio_selected = false;

// dom access
const station_display = document.getElementById("current-station");
const play_button = document.getElementById("play-btn");
const stop_button = document.getElementById("stop-btn");




// PROGRAM STARTS HERE

// setup (these will be generated, no point in saving as dom accesses)
document.querySelector("#fluxfm-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_FLUXFM));
document.querySelector("#chillofi-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_CHILLOFI));
document.querySelector("#vaporwave-btn").addEventListener("click", (event) => set_station(event.currentTarget, ID_VAPORWAVE));

// keep these
play_button.addEventListener("click", () => play());
stop_button.addEventListener("click", () => stop());








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
    audio.src = selected_station.getUrl();
    audio.load()
}

// radio CONTROLS!!!

function play() {
    play_button.disabled = true;
    play_button.classList.add("active");

    stop_button.disabled = false;
    stop_button.classList.remove("active");

    audio.play()
}

function stop() {

    play_button.classList.remove("active");
    play_button.disabled = false;

    stop_button.disabled = true;
    stop_button.classList.add("active");

    audio.pause()
}



// TIMER FUNCTIONS ---------------

