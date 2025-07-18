import { useState } from "react";
import "./index.css";
import { Button } from "@/components/ui/button";

import SimpleVideoPlayer from "@/components/SimpleVideoPlayer";

function App() {
  // Commented out unused state variables
  // const [appVersion, setAppVersion] = useState<string>("");
  // const [platform, setPlatform] = useState<string>("");
  const [emotion, setEmotion] = useState<string>('neutral');

  // Commented out useEffect that was using the removed state variables
  // useEffect(() => {
  //   // Check if we're running in Electron
  //   if (window.electronAPI) {
  //     window.electronAPI.getAppVersion().then(setAppVersion);
  //     window.electronAPI.getPlatform().then(setPlatform);
  //   }
  // }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      {/* Custom Title Bar */}
      <div
        className="flex items-center justify-center px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="text-sm font-medium text-gray-700">Ann AI</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Commented out card container as requested */}
        {/* 
        <Card variant="glass" className="max-w-md mx-auto">
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
        */}

        {/* Video Character Display */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Emotion Controls */}
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setEmotion('positive')}
              variant={emotion === 'positive' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Happy
            </Button>
            <Button
              onClick={() => setEmotion('neutral')}
              variant={emotion === 'neutral' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Neutral
            </Button>
            <Button
              onClick={() => setEmotion('negative')}
              variant={emotion === 'negative' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Angry
            </Button>
          </div>

          {/* Video Character Container */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            {/* Working Video Player with Emotion Switching */}
            <SimpleVideoPlayer emotion={emotion} />
            {/* 
            <VideoCharacterDisplay
              characterId="ann-ai"
              emotion={emotion}
              autoPlay={true}
              aspectRatio="16:9"
              onPerformanceMetrics={setMetrics}
              onError={(error) => console.error('Video error:', error)}
            />
            */}
          </div>



          {/* App Info (moved to bottom) */}
          {/* {appVersion && (
            <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg max-w-md mx-auto">
              <div className="space-y-1 text-xs text-gray-600 text-center">
                <p><strong>App Version:</strong> {appVersion}</p>
                <p><strong>Platform:</strong> {platform}</p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default App;