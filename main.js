// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { dbOperations } = require("./src/services/postgressService.js");
const academicYearDataList = require("./src/config/academicYear.json");

let mainWindow;

const academicYearData = academicYearDataList?.data;

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
        results = await dbOperations(`SELECT * FROM session_2024;`, value);
      } else {
        results = await dbOperations(
          `SELECT * FROM session_2024 where '${value}' % ANY(STRING_TO_ARRAY(name,' '));`
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
        `SELECT * FROM session_2024 where name = '${value?.name}'AND class = '${value?.class}' AND rollno = '${value?.rollno}';`
      );

      console.log("This is result in ipc main", results);
      event.returnValue = results;
      return results;
    });

    // make a transaction api

    ipcMain.on("make-student-payment", async (event, values = {}) => {
      console.log("This is the payload", values);
      let results;
      let {
        admission_no,
        name,
        class_value,
        fee_paid,
        total_amount,
        misc_charge = {},
      } = values;
      const date = new Date(Date.now()).toISOString();
      fee_paid = JSON.stringify(fee_paid);
      misc_charge = JSON.stringify(misc_charge);
      console.log(fee_paid);

      try {
        // Check if the format of the values are correct & not null

        if (!admission_no || !name || !class_value) {
          return null;
        }

        // make the db call to add transactions
        let trans_id;
        [results] = await dbOperations(`
        INSERT INTO transactions_2024(admission_no,name,class,fee_paid,total_amount,misc_charge,status,cashier,timestamp)
        VALUES('${admission_no}','${name}','${class_value}','${fee_paid}',${total_amount}, '${misc_charge}' , 'completed','arpan','${date}')
        RETURNING trans_id;
        `);

        // make the db call to session table
        let finalResult;

        if (results) {
          let monthIds = values.fee_paid.monthIds;
          let otherCharges = values.fee_paid.otherCharges;

          const otherChargesList = [
            "session_charge",
            "school_fund",
            "exam_fee",
          ];

          let insertString = "";
          let valueString = "";

          for (let key in academicYearData) {
            if (monthIds[key]) {
              insertString += academicYearData[key].keyId + " = ";
              insertString += monthIds[key] + ",";
            }
          }

          for (let key in otherChargesList) {
            if (otherCharges[otherChargesList[key]]) {
              insertString += otherChargesList[key] + " =";
              insertString += otherCharges[otherChargesList[key]] + ",";
            }
          }

          // remove last ,

          insertString = insertString.slice(0, -1);

          console.log(insertString);
          console.log(valueString);

          [finalResult] = await dbOperations(
            `UPDATE session_2024
             SET ${insertString}
             WHERE admission_no = '${admission_no}'  
             RETURNING admission_no;
            `
          );

          if (!finalResult?.admission_no) {
            // db rollback

            await dbOperations(`
              UPDATE transactions
              SET status = 'failed'
              WHERE trans_id = ${results.trans_id}
              `);

            throw "Something went wrong";
          }
        }

        results = { ...finalResult, ...results };

        console.log("The query ran");
        event.returnValue = results;

        return results;

        // fail check => throw error.
      } catch (error) {
        event.returnValue = error;

        console.log(error);
        return error;
      }
    });

    // fetch transactions

    ipcMain.on("fetch_transactions", async (event, values = {}) => {
      let results;
      const { admission_no } = values;
      if (admission_no) {
        results = await dbOperations(
          `SELECT * FROM transactions_2024 WHERE admission_no = '${admission_no}' ORDER BY timestamp DESC;`
        );
      } else {
        results = await dbOperations(
          `SELECT * FROM transactions_2024 ORDER BY timestamp DESC;`
        );
      }
      console.log("transactions", results);
      event.returnValue = results;
      return results;
    });
    createWindow();
    require("./src/services/postgressService");
  }
});
