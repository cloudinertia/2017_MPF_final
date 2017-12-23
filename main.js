const electron = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow
let debug = true
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function createWindow () {
  mainWindow = new BrowserWindow({width: 1100, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  if (debug)
    mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
