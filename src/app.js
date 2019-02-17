import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import child_process from 'child_process';

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const settings = require('../settings.json');
const games = require(path.join(settings.exotools.installPath, 'games.json'));
let installedGames = ((games) => {
  let i = [];
  Object.keys(games).forEach((k) => {
    let v = games[k];
    v.guid = k;
    i.push(v);
  })
  return i;
})(games.installed);

let win;
const init = () => {
  win = new BrowserWindow({
    title: 'eXo Launcher',
    width: 800,
    height: 600,
  });
  win.loadURL(`file://${__dirname}/views/index.html`);

  //win.webContents.openDevTools();
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('exo-data', installedGames);
  });

  win.setMenu(null);

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', init);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (win === null) {
    init();
  }
});

ipcMain.on('start-game', (e, game) => {
  child_process.exec(`python exorun.py "${path.join(settings.exotools.installPath, game)}"`);
});
