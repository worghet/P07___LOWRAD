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
	  width: 950,
	  height: 440,
	  backgroundColor: '#FFFFFF',
	  autoHideMenuBar: true,
	  title: "LOWRAD",
	  resizable: true,
        icon: path.join(__dirname, "lowrad_icon.png")

    });
    mainWindow.setMinimumSize(950, 440); // width, height


    mainWindow.loadFile("workshop.html");

    mainWindow.setAspectRatio(950 / 440); // locks resizing to 16:9


    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.setZoomFactor(1); // 1 = 100%
    });

    mainWindow.on('resize', () => {
        const [width, height] = mainWindow.getSize();
        const baseHeight = 950;      // your "100%" scale reference
        const scaleFactor = 2.1*height / baseHeight;
        mainWindow.webContents.setZoomFactor(scaleFactor);
    });



	//mainWindow.loadFile('sample_ui.html');

	// set window content to my github page :)
	// mainWindow.loadURL('https://github.com/worghet');
	
});

