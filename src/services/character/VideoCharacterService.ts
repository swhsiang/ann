export interface VideoCharacterService {
  getVideoPath(characterId: string, emotion?: string): string;
  preloadVideo(videoPath: string): Promise<void>;
  getAvailableVideos(characterId: string): string[];
  getVideoByEmotion(emotion: string): string;
}

export interface VideoMetrics {
  loadTime: number;
  videoSize: number;
  playbackQuality: 'high' | 'medium' | 'low';
}

export interface EmotionVideoMapping {
  positive: string[];
  negative: string[];
  neutral: string[];
}

export class VideoCharacterServiceImpl implements VideoCharacterService {
  private videoCache = new Map<string, HTMLVideoElement>();
  private emotionMappings: EmotionVideoMapping = {
    positive: [
      '/video/cheer-leader.mp4',
      '/video/dancing.mp4',
      '/video/yah.mp4'
    ],
    negative: [
      '/video/negative/angry.mp4'
    ],
    neutral: [
      '/video/chilling.mp4',
      '/video/video-3d-model.mp4'
    ]
  };

  getVideoPath(characterId: string, emotion?: string): string {
    if (emotion) {
      return this.getVideoByEmotion(emotion);
    }
    
    // Default to neutral videos for character
    const neutralVideos = this.emotionMappings.neutral;
    const randomIndex = Math.floor(Math.random() * neutralVideos.length);
    return neutralVideos[randomIndex];
  }

  async preloadVideo(videoPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.videoCache.has(videoPath)) {
        resolve();
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = videoPath;
      
      const onCanPlayThrough = () => {
        this.videoCache.set(videoPath, video);
        video.removeEventListener('canplaythrough', onCanPlayThrough);
        video.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        video.removeEventListener('canplaythrough', onCanPlayThrough);
        video.removeEventListener('error', onError);
        reject(new Error(`Failed to preload video: ${videoPath}`));
      };

      video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
      video.addEventListener('error', onError, { once: true });
    });
  }

  getAvailableVideos(characterId: string): string[] {
    return [
      ...this.emotionMappings.positive,
      ...this.emotionMappings.negative,
      ...this.emotionMappings.neutral
    ];
  }

  getVideoByEmotion(emotion: string): string {
    const emotionKey = emotion.toLowerCase() as keyof EmotionVideoMapping;
    const videos = this.emotionMappings[emotionKey] || this.emotionMappings.neutral;
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }
}