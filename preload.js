const { ipcRenderer, contextBridge } = require("electron");
// const { dbOperations }  = require('./src/services/postgressService');

contextBridge.exposeInMainWorld("electronAPI", {
  search: (value) => {
    const result = ipcRenderer.sendSync("search-api", value);
    console.log("this is preload file", result);
    return result;
  },
  find_student: (value) => {
    const result = ipcRenderer.sendSync("fetch-student-detail", value);
    console.log("This is the result of the student", result);
    return result;
  },

  // : {
  //     search(message) {
  //         console.log("this is the message", message);
  //         ipcRenderer.send('notify', message);
  //     },
  //     fetchAll(){
  //         console.log("This is fetching all the details");
  //         ipcRenderer.send('fetchAll');w
  //     }
  // }
});
