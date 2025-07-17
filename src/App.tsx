import { useState, useEffect } from "react";
import "./index.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Virtual Character App</CardTitle>
          <CardDescription>
            Welcome to your Ann AI desktop application built with Electron, React, and TypeScript.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This foundation includes shadcn/ui components for a modern, accessible interface.
          </p>
          {appVersion && (
            <div className="space-y-2 text-sm">
              <p><strong>App Version:</strong> {appVersion}</p>
              <p><strong>Platform:</strong> {platform}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button>Get Started - 1</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;