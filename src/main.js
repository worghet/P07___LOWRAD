const electron = require('electron');
const app = electron.app;
const path = require('path');

//const { app, BrowserWindow } = require('electron');


// get object from electron library
const BrowserWindow = electron.BrowserWindow

var mainWindow;

// what to do when app ready
app.on('ready', function() {

	// render window
	mainWindow = new BrowserWindow({
	  width: 800,
	  height: 350,
	  backgroundColor: '#FFFFFF',
	  autoHideMenuBar: true,
	  title: "LOWRAD",
	  resizable: false,
        });
	
	if (process.env.ELECTRON_START_URL) {
	    // Dev mode: Vite server
	    mainWindow.loadURL(process.env.ELECTRON_START_URL);
	} else {
	    // Prod mode: built React files
	    mainWindow.loadFile(path.join(__dirname, "ui/dist/index.html"));
	}


	//mainWindow.loadFile('sample_ui.html');

	// set window content to my github page :)
	// mainWindow.loadURL('https://github.com/worghet');
	
});

