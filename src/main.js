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
	

	mainWindow.loadFile('index.html');

	// set window content to my github page :)
	// mainWindow.loadURL('https://github.com/worghet');
	
});

