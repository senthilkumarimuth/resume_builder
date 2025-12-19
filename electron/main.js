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

  // Create profiles table for multi-profile support
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      data TEXT NOT NULL,
      template TEXT DEFAULT 'modern',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrate existing resume_data to profiles if needed
  migrateToProfiles();

  console.log('Database initialized at:', dbPath);
}

// Migrate old single-resume data to profiles table
function migrateToProfiles() {
  try {
    const profileCount = db.prepare('SELECT COUNT(*) as count FROM profiles').get();

    if (profileCount.count === 0) {
      // No profiles exist, check if old data exists
      const oldData = db.prepare('SELECT data FROM resume_data ORDER BY updated_at DESC LIMIT 1').get();

      if (oldData) {
        // Migrate old data to profiles as "Default Profile"
        const insertStmt = db.prepare('INSERT INTO profiles (name, data, template) VALUES (?, ?, ?)');
        insertStmt.run('Default Profile', oldData.data, 'modern');
        console.log('Migrated existing resume data to Default Profile');
      } else {
        // No old data, create a default empty profile
        const defaultData = JSON.stringify({
          personalInfo: { fullName: '', email: '', phone: '' },
          summary: '',
          workExperience: [],
          education: [],
          skills: [],
          personalDetails: {
            fatherName: '',
            dateOfBirth: '',
            gender: '',
            maritalStatus: '',
            languagesKnown: '',
            nationality: '',
          },
          sectionVisibility: {
            summary: true,
            skills: true,
            workExperience: true,
            education: true,
            personalDetails: true,
          },
        });
        const insertStmt = db.prepare('INSERT INTO profiles (name, data, template) VALUES (?, ?, ?)');
        insertStmt.run('Default Profile', defaultData, 'modern');
        console.log('Created default empty profile');
      }
    }
  } catch (error) {
    console.error('Error migrating to profiles:', error);
  }
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

// Profile management IPC handlers
ipcMain.handle('get-all-profiles', async () => {
  try {
    const stmt = db.prepare('SELECT id, name, updated_at FROM profiles ORDER BY updated_at DESC');
    const profiles = stmt.all();
    return { success: true, profiles };
  } catch (error) {
    console.error('Error getting all profiles:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-profile', async (event, profileId) => {
  try {
    const stmt = db.prepare('SELECT id, name, data, template, updated_at FROM profiles WHERE id = ?');
    const profile = stmt.get(profileId);

    if (profile) {
      return {
        success: true,
        profile: {
          id: profile.id,
          name: profile.name,
          data: JSON.parse(profile.data),
          template: profile.template,
          updatedAt: profile.updated_at,
        },
      };
    }

    return { success: false, error: 'Profile not found' };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-profile', async (event, profileId, name, data, template) => {
  try {
    const jsonData = JSON.stringify(data);
    const stmt = db.prepare(
      'UPDATE profiles SET name = ?, data = ?, template = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(name, jsonData, template, profileId);
    return { success: true };
  } catch (error) {
    console.error('Error saving profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-profile', async (event, name, data, template) => {
  try {
    const jsonData = JSON.stringify(data);
    const stmt = db.prepare('INSERT INTO profiles (name, data, template) VALUES (?, ?, ?)');
    const result = stmt.run(name, jsonData, template);
    return { success: true, profileId: result.lastInsertRowid };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-profile', async (event, profileId) => {
  try {
    // Check if this is the last profile
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM profiles');
    const { count } = countStmt.get();

    if (count <= 1) {
      return { success: false, error: 'Cannot delete the last profile' };
    }

    const stmt = db.prepare('DELETE FROM profiles WHERE id = ?');
    stmt.run(profileId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('duplicate-profile', async (event, profileId, newName) => {
  try {
    // Get the profile to duplicate
    const getStmt = db.prepare('SELECT data, template FROM profiles WHERE id = ?');
    const profile = getStmt.get(profileId);

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Create new profile with the same data
    const insertStmt = db.prepare('INSERT INTO profiles (name, data, template) VALUES (?, ?, ?)');
    const result = insertStmt.run(newName, profile.data, profile.template);

    return { success: true, profileId: result.lastInsertRowid };
  } catch (error) {
    console.error('Error duplicating profile:', error);
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
