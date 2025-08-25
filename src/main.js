// Setup Electron.
const electron = require('electron');
const app = electron.app;

// Constants for later.
const path = require('path');
const DEFAULT_HEIGHT = 950


// Get BrowserWindow class from electron library.
const BrowserWindow = electron.BrowserWindow

// Window object.
let window;

// What to do when the app is ready.
app.on('ready', function() {

    // Build / Set up the window.

    build_window()

    // Add "dynamic functions".

    window.on('resize', () => scale_window_contents());

});

function build_window() {

    // Construct the BrowserWindowobject.
    window = new BrowserWindow({
        width: 950,
        height: 440,
        backgroundColor: '#FFFFFF',
        autoHideMenuBar: true,
        title: "LOWRAD",
        resizable: true,
        icon: path.join(__dirname, "lowrad_icon.png")
    });

    // Set minimum size.
    window.setMinimumSize(950, 440);

    // Set a locked aspect ratio.
    window.setAspectRatio(950 / 440);


    // Set the contents to be the html.
    window.loadFile("workshop.html");

    // Reset scale factor on load.
    window.webContents.on('did-finish-load', () => {
        window.webContents.setZoomFactor(1);
    });

}

function scale_window_contents() {

    // Get current size of window.
    const [width, height] = window.getSize();

    // Calculate scale factor (made these # up, just works)
    const scaleFactor = 2.1*height / DEFAULT_HEIGHT;

    // Apply the zoom factor.
    window.webContents.setZoomFactor(scaleFactor);

}

