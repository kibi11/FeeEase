const {ipcRenderer , contextBridge} = require('electron');
import {dbOperations} from './src/services/postgressService';

contextBridge.exposeInMainWorld('electron', {
    Api: {
        search(message) {
            console.log("this is the message", message);
            ipcRenderer.send('notify', message);
        },
        fetchAll(){
            console.log("This is fetching all the details");
            ipcRenderer.send('fetchAll');w
        }
    }
})