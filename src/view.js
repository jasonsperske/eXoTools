const $ = require('jquery');
const { ipcRenderer } = require('electron');

const gamesList = $('#Games');

ipcRenderer.on('exo-data', (ipcEvent, games) => {
  games.forEach((game) => {
    gamesList.append($(`<li data-game="${game.guid}">${game.title}</li>`));
  })
});

gamesList.on('click', 'li', (e) => {
  ipcRenderer.send('start-game', $(e.currentTarget).data('game'));
});
