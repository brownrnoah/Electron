//Bring in your required libraries
const electron = require("electron");
const url = require("url");
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain} = electron;
//Create the windows used in the app.
let mainWindow;
let addWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({})

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'MainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Gives functionality to the "X" button.
    mainWindow.on('closed', function () {
        app.quit();
    })
    //Add toolbar to window
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});
//Make the window used to add items to the list.
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    })

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Add functionality to close the window.
    addWindow.on('close', function () {
        addWindow = null;
    })
}

ipcMain.on('item:add', function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})
//Create the toolbar at the top of your application.
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]
//Render the toolbar slightly different on a Mac.
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}
//Conditon to render DevTools depending on what mode you are in.
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
        ]
    })
}