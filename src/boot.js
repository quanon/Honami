import app from 'app';
import BrowserWindow from 'browser-window';
import CrashReporter from 'crash-reporter';

if (process.env.NODE_ENV === 'develop') {
  CrashReporter.start();
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});
