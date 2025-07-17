import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    // Check if we're running in Electron
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(setAppVersion);
      window.electronAPI.getPlatform().then(setPlatform);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Virtual Character App
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Welcome to Your Virtual Character Desktop App
          </h1>
          <p className="mt-2 text-gray-500">
            This is the foundation for your virtual character application built with Electron, React, and TypeScript.
          </p>
          {appVersion && (
            <div className="mt-4 text-sm text-gray-600">
              <p>App Version: {appVersion}</p>
              <p>Platform: {platform}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;