const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

let mainWindow;
let db;

// Initialize SQLite database
function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'resume.db');
  db = new Database(dbPath);

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS resume_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized at:', dbPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/vite.svg')
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers for database operations
ipcMain.handle('save-resume', async (event, data) => {
  try {
    const jsonData = JSON.stringify(data);
    const stmt = db.prepare('SELECT id FROM resume_data LIMIT 1');
    const existing = stmt.get();

    if (existing) {
      const updateStmt = db.prepare('UPDATE resume_data SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      updateStmt.run(jsonData, existing.id);
    } else {
      const insertStmt = db.prepare('INSERT INTO resume_data (data) VALUES (?)');
      insertStmt.run(jsonData);
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving resume:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-resume', async () => {
  try {
    const stmt = db.prepare('SELECT data FROM resume_data ORDER BY updated_at DESC LIMIT 1');
    const row = stmt.get();

    if (row) {
      return { success: true, data: JSON.parse(row.data) };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error('Error loading resume:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clear-resume', async () => {
  try {
    const stmt = db.prepare('DELETE FROM resume_data');
    stmt.run();
    return { success: true };
  } catch (error) {
    console.error('Error clearing resume:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});
