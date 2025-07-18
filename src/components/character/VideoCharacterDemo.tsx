import React, { useState } from 'react';
import { VideoCharacterDisplay } from './VideoCharacterDisplay';
import { VideoMetrics } from '../../services/character/VideoCharacterService';

export const VideoCharacterDemo: React.FC = () => {
  const [emotion, setEmotion] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<VideoMetrics | null>(null);

  const handlePerformanceMetrics = (metrics: VideoMetrics) => {
    setMetrics(metrics);
    console.log('Performance metrics:', metrics);
  };

  const handleMemoryUsage = (usage: number) => {
    console.log('Memory usage:', usage);
  };

  const handleVideoChange = (videoPath: string) => {
    console.log('Video changed to:', videoPath);
  };

  const handleError = (error: Error) => {
    console.error('Video error:', error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Character Display Demo</h1>
      
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Random</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        
        {metrics && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Performance Metrics:</h3>
            <p>Load Time: {metrics.loadTime}ms</p>
            <p>Video Size: {metrics.videoSize} pixels</p>
            <p>Quality: {metrics.playbackQuality}</p>
          </div>
        )}
      </div>

      {/* Video Character Display */}
      <div className="w-full h-96 border rounded-lg overflow-hidden">
        <VideoCharacterDisplay
          characterId="demo-character"
          emotion={emotion || undefined}
          isPlaying={isPlaying}
          aspectRatio="16:9"
          onPerformanceMetrics={handlePerformanceMetrics}
          onMemoryUsage={handleMemoryUsage}
          onVideoChange={handleVideoChange}
          onError={handleError}
        />
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>HTML5 video-based character display with cross-fade transitions</li>
          <li>Emotion-based video selection (positive, negative, neutral)</li>
          <li>Play/pause controls with proper state management</li>
          <li>Performance monitoring and metrics collection</li>
          <li>Error handling with retry functionality</li>
          <li>Responsive design with aspect ratio control</li>
          <li>TDD-driven development with comprehensive test coverage</li>
        </ul>
      </div>
    </div>
  );
};