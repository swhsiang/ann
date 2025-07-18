import { useState, useEffect, useRef } from 'react';

interface SimpleVideoPlayerProps {
  emotion: string;
}

const SimpleVideoPlayer: React.FC<SimpleVideoPlayerProps> = ({ emotion }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<string>('/video/chilling.mp4');
  const [isLoading, setIsLoading] = useState(false);

  // Video mapping based on emotion
  const getVideoByEmotion = (emotion: string): string => {
    const videoMap: Record<string, string[]> = {
      positive: ['/video/cheer-leader.mp4', '/video/dancing.mp4', '/video/yah.mp4'],
      negative: ['/video/negative/angry.mp4'],
      neutral: ['/video/chilling.mp4', '/video/video-3d-model.mp4']
    };

    const videos = videoMap[emotion] || videoMap.neutral;
    return videos[Math.floor(Math.random() * videos.length)];
  };

  // Handle emotion changes
  useEffect(() => {
    const newVideo = getVideoByEmotion(emotion);
    if (newVideo !== currentVideo) {
      setIsLoading(true);
      setCurrentVideo(newVideo);
    }
  }, [emotion, currentVideo]);

  // Handle video load
  const handleVideoLoad = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        key={currentVideo} // Force re-render when video changes
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoad}
        onError={() => {
          setIsLoading(false);
          console.error('Failed to load video:', currentVideo);
        }}
      >
        <source src={currentVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video info overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        Emotion: {emotion} | Video: {currentVideo.split('/').pop()}
      </div>
    </div>
  );
};

export default SimpleVideoPlayer;