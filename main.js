// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minHeight: 600,
      minWidth: 800,
      backgroundColor: "white",
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    mainWindow.loadFile('index.html');    
};

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})


app.whenReady().then(createWindow);