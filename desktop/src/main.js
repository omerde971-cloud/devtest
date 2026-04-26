import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV === 'development'

let mainWindow
let backendProcess

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3001')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../frontend/dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const startBackend = () => {
  return new Promise((resolve) => {
    // In production, backend is served by main process
    // In development, connect to existing server
    if (!isDev) {
      // Backend is embedded in backend folder
      const backendPath = path.join(__dirname, '../../backend/dist/index.js')
      backendProcess = spawn('node', [backendPath], {
        detached: true,
        stdio: 'ignore',
      })
      backendProcess.unref()
    }

    // Wait for backend to start
    setTimeout(resolve, 2000)
  })
}

app.on('ready', async () => {
  console.log('Starting DevTest Desktop App...')
  await startBackend()
  createWindow()
  createMenu()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Kill backend process
    if (backendProcess) {
      process.kill(-backendProcess.pid)
    }
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const createMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            if (backendProcess) {
              process.kill(-backendProcess.pid)
            }
            app.quit()
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload()
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools()
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About DevTest',
          click: () => {
            // Show about dialog
          },
        },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// IPC handlers
ipcMain.on('app-version', (event) => {
  event.reply('app-version', {
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
  })
})
