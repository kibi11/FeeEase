// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { dbOperations } = require("./src/services/postgressService.js");

let mainWindow;

require("dotenv").config();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "favicon.ico"),
  });

  mainWindow.loadFile("index.html");
  // const startUrl =
  //   process.env.ELECTRON_START_URL ||
  //   url.format({
  //     pathname: path.join(__dirname, "/../build/index.html"),
  //     protocol: "file:",
  //     slashes: true,
  //   });
  // mainWindow.loadURL(startUrl);

  mainWindow.webContents.openDevTools();
}

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

app.setAsDefaultProtocolClient("feeease");

app.whenReady().then(() => {
  {
    //search api
    ipcMain.on("search-api", async (event, value) => {
      console.log("This is ipc Main", value);
      let results;
      if (value.length == 0) {
        results = await dbOperations(`SELECT * FROM student_details;`, value);
      } else {
        results = await dbOperations(
          `SELECT * FROM student_details where '${value}' % ANY(STRING_TO_ARRAY(name,' '));`
        );
      }
      console.log("This is result in ipc main", results);
      event.returnValue = results;
      return results;
    });

    // find student detail api
    ipcMain.on("fetch-student-detail", async (event, value) => {
      console.log("This is main js", value);
      let results;
      if (!value) {
        return null;
      }
      results = await dbOperations(
        `SELECT * FROM student_details where name = '${value?.name}'AND class = '${value?.class}' AND rollno = '${value?.rollno}';`
      );

      console.log("This is result in ipc main", results);
      event.returnValue = results;
      return results;
    });
    createWindow();
    require("./src/services/postgressService");
  }
});
