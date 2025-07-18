import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoMetrics, VideoCharacterServiceImpl } from '../../services/character/VideoCharacterService';

export interface VideoCharacterDisplayProps {
  characterId: string;
  autoPlay?: boolean;
  isPlaying?: boolean;
  emotion?: string;
  aspectRatio?: string;
  onPerformanceMetrics?: (metrics: VideoMetrics) => void;
  onMemoryUsage?: (usage: number) => void;
  onVideoChange?: (videoPath: string) => void;
  onError?: (error: Error) => void;
}

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  currentVideoPath: string;
  isTransitioning: boolean;
}

export const VideoCharacterDisplay: React.FC<VideoCharacterDisplayProps> = ({
  characterId,
  autoPlay = true,
  isPlaying = true,
  emotion,
  aspectRatio = '16:9',
  onPerformanceMetrics,
  onMemoryUsage,
  onVideoChange,
  onError
}) => {
  // Dual video refs for cross-fade effect (inspired by the sample code)
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const inactiveVideoRef = useRef<HTMLVideoElement | null>(null);
  
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    hasError: false,
    errorMessage: '',
    currentVideoPath: '',
    isTransitioning: false
  });

  const [videoService] = useState(() => new VideoCharacterServiceImpl());
  const loadStartTime = useRef<number>(0);

  // Initialize video refs
  useEffect(() => {
    if (video1Ref.current && video2Ref.current) {
      activeVideoRef.current = video1Ref.current;
      inactiveVideoRef.current = video2Ref.current;
    }
  }, []);

  // Performance monitoring
  const trackPerformance = useCallback((videoElement: HTMLVideoElement) => {
    if (onPerformanceMetrics && loadStartTime.current) {
      const loadTime = Date.now() - loadStartTime.current;
      const videoSize = videoElement.videoWidth * videoElement.videoHeight;
      
      onPerformanceMetrics({
        loadTime,
        videoSize,
        playbackQuality: videoSize > 1920 * 1080 ? 'high' : videoSize > 1280 * 720 ? 'medium' : 'low'
      });
    }
  }, [onPerformanceMetrics]);

  // Memory usage monitoring
  useEffect(() => {
    if (!onMemoryUsage) return;

    const interval = setInterval(() => {
      // Estimate memory usage based on video elements
      // Note: performance.memory is a Chrome-specific API
      const performanceWithMemory = performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
        };
      };
      const usage = performanceWithMemory.memory?.usedJSHeapSize || 0;
      onMemoryUsage(usage);
    }, 1000);

    return () => clearInterval(interval);
  }, [onMemoryUsage]);

  // Load initial video
  useEffect(() => {
    const loadInitialVideo = async () => {
      try {
        loadStartTime.current = Date.now();
        const videoPath = videoService.getVideoPath(characterId, emotion);
        
        setVideoState(prev => ({
          ...prev,
          isLoading: true,
          hasError: false,
          currentVideoPath: videoPath
        }));

        await videoService.preloadVideo(videoPath);
        
        if (activeVideoRef.current) {
          activeVideoRef.current.src = videoPath;
          activeVideoRef.current.load();
        }

        onVideoChange?.(videoPath);
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Failed to load video');
        setVideoState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: errorObj.message
        }));
        onError?.(errorObj);
      }
    };

    loadInitialVideo();
  }, [characterId, emotion, videoService, onVideoChange, onError]);

  // Handle video loaded
  const handleVideoLoaded = useCallback((videoElement: HTMLVideoElement) => {
    setVideoState(prev => ({
      ...prev,
      isLoading: false,
      hasError: false
    }));

    trackPerformance(videoElement);

    if (autoPlay && isPlaying) {
      const playPromise = videoElement.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(error => {
          console.error('Auto-play failed:', error);
        });
      }
    }
  }, [autoPlay, isPlaying, trackPerformance]);

  // Handle video error
  const handleVideoError = useCallback((_error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const errorMessage = 'Failed to load character video';
    setVideoState(prev => ({
      ...prev,
      isLoading: false,
      hasError: true,
      errorMessage
    }));
    onError?.(new Error(errorMessage));
  }, [onError]);

  // Cross-fade video transition (adapted from sample code)
  const switchVideo = useCallback(async (newEmotion?: string) => {
    if (!activeVideoRef.current || !inactiveVideoRef.current || videoState.isTransitioning) {
      return;
    }

    try {
      setVideoState(prev => ({ ...prev, isTransitioning: true }));

      const nextVideoPath = videoService.getVideoPath(characterId, newEmotion);
      
      // Avoid switching to the same video
      if (nextVideoPath === videoState.currentVideoPath) {
        setVideoState(prev => ({ ...prev, isTransitioning: false }));
        return;
      }

      // Preload next video in inactive element
      await videoService.preloadVideo(nextVideoPath);
      inactiveVideoRef.current.src = nextVideoPath;
      inactiveVideoRef.current.load();

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const onCanPlayThrough = () => {
          inactiveVideoRef.current?.removeEventListener('canplaythrough', onCanPlayThrough);
          inactiveVideoRef.current?.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          inactiveVideoRef.current?.removeEventListener('canplaythrough', onCanPlayThrough);
          inactiveVideoRef.current?.removeEventListener('error', onError);
          reject(new Error('Failed to load next video'));
        };

        inactiveVideoRef.current?.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        inactiveVideoRef.current?.addEventListener('error', onError, { once: true });
      });

      // Start playing the new video
      if (isPlaying) {
        await inactiveVideoRef.current.play();
      }

      // Cross-fade transition
      if (activeVideoRef.current && inactiveVideoRef.current) {
        activeVideoRef.current.classList.remove('active');
        inactiveVideoRef.current.classList.add('active');

        // Swap refs
        [activeVideoRef.current, inactiveVideoRef.current] = [inactiveVideoRef.current, activeVideoRef.current];
      }

      setVideoState(prev => ({
        ...prev,
        currentVideoPath: nextVideoPath,
        isTransitioning: false
      }));

      onVideoChange?.(nextVideoPath);
    } catch (error) {
      setVideoState(prev => ({
        ...prev,
        isTransitioning: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Video transition failed'
      }));
      onError?.(error instanceof Error ? error : new Error('Video transition failed'));
    }
  }, [characterId, videoService, videoState.currentVideoPath, videoState.isTransitioning, isPlaying, onVideoChange, onError]);

  // Handle emotion changes
  useEffect(() => {
    if (emotion && emotion !== videoState.currentVideoPath) {
      switchVideo(emotion);
    }
  }, [emotion, switchVideo, videoState.currentVideoPath]);

  // Handle play/pause state changes
  useEffect(() => {
    if (activeVideoRef.current && !videoState.isLoading) {
      if (isPlaying) {
        const playPromise = activeVideoRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(console.error);
        }
      } else {
        activeVideoRef.current.pause();
      }
    }
  }, [isPlaying, videoState.isLoading]);

  // Retry loading video
  const retryLoading = useCallback(() => {
    if (activeVideoRef.current) {
      setVideoState(prev => ({
        ...prev,
        isLoading: true,
        hasError: false,
        errorMessage: ''
      }));
      activeVideoRef.current.load();
    }
  }, []);

  // Get aspect ratio style
  const getAspectRatioStyle = () => {
    if (aspectRatio === '16:9') return { className: 'aspect-video', style: undefined };
    if (aspectRatio === '4:3') return { className: '', style: { aspectRatio: '4/3' } };
    
    const [width, height] = aspectRatio.split(':').map(Number);
    return { className: '', style: { aspectRatio: `${width}/${height}` } };
  };

  return (
    <div 
      data-testid="video-character-container"
      className="relative w-full h-full overflow-hidden rounded-lg bg-black"
    >
      {/* Dual video elements for cross-fade */}
      <video
        ref={video1Ref}
        data-testid="character-video"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 active ${getAspectRatioStyle().className}`}
        style={getAspectRatioStyle().style}
        muted={true}
        loop={true}
        playsInline={true}
        onLoadedData={(e) => handleVideoLoaded(e.currentTarget)}
        onError={handleVideoError}
      />
      
      <video
        ref={video2Ref}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0"
        muted
        loop
        playsInline
        onLoadedData={(e) => handleVideoLoaded(e.currentTarget)}
        onError={handleVideoError}
      />

      {/* Loading overlay */}
      {videoState.isLoading && (
        <div 
          data-testid="video-loading"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading character...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {videoState.hasError && (
        <div 
          data-testid="video-error"
          className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50"
        >
          <div className="text-white text-center p-4">
            <p className="mb-4">Failed to load character video</p>
            <button
              data-testid="video-retry-button"
              onClick={retryLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Transition overlay */}
      {videoState.isTransitioning && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            Switching...
          </div>
        </div>
      )}
    </div>
  );
};