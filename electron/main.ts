import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils";

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    transparent: true,
    frame: false,
    backgroundColor: undefined,
    titleBarStyle: "hidden",
  });

  if (isDev) {
    // In development, try to load from Vite dev server
    mainWindow.loadURL("http://localhost:5173").catch((error) => {
      console.error("Failed to load development server:", error);
      console.log("Please start the development server with: npm run dev");

      // Show an error page instead of crashing
      mainWindow?.loadURL(`data:text/html;charset=utf-8,
        <html>
          <head><title>Development Server Not Running</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1>Development Server Not Running</h1>
            <p>The Vite development server is not running on port 5173.</p>
            <p>Please start the development server with:</p>
            <code style="background: #f0f0f0; padding: 10px; display: block; margin: 20px 0;">npm run dev</code>
            <p>Or use the production build with:</p>
            <code style="background: #f0f0f0; padding: 10px; display: block; margin: 20px 0;">npm run start:prod</code>
          </body>
        </html>
      `);
    });
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for virtual character functionality
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

// Window control handlers
ipcMain.handle("window-close", () => {
  mainWindow?.close();
});

ipcMain.handle("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});