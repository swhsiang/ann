import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoCharacterDisplay } from '../VideoCharacterDisplay';

// Mock the VideoCharacterService
const mockVideoService = {
  getVideoPath: jest.fn(),
  preloadVideo: jest.fn(),
  getAvailableVideos: jest.fn(),
  getVideoByEmotion: jest.fn(),
};

jest.mock('../../../services/character/VideoCharacterService', () => ({
  VideoCharacterServiceImpl: jest.fn().mockImplementation(() => mockVideoService)
}));

// Mock HTMLVideoElement methods
const mockPlay = jest.fn().mockImplementation(() => Promise.resolve());
const mockPause = jest.fn();
const mockLoad = jest.fn();

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: mockPlay,
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: mockPause,
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: mockLoad,
});

// Mock video properties
Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 10,
});

Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
  writable: true,
  value: 4, // HAVE_ENOUGH_DATA
});

describe('VideoCharacterDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlay.mockClear();
    mockPause.mockClear();
    mockLoad.mockClear();
    mockVideoService.getVideoPath.mockReturnValue('/video/chilling.mp4');
    mockVideoService.preloadVideo.mockResolvedValue(undefined);
    mockVideoService.getAvailableVideos.mockReturnValue(['/video/chilling.mp4', '/video/dancing.mp4']);
    mockVideoService.getVideoByEmotion.mockReturnValue('/video/chilling.mp4');
  });

  describe('Component Rendering', () => {
    it('should render video element with correct attributes', () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      const videoElement = screen.getByTestId('character-video');
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute('loop');
      expect(videoElement).toHaveAttribute('playsinline');
      // Note: muted attribute might not be set in JSDOM, but the property should be true
      expect((videoElement as HTMLVideoElement).muted).toBe(true);
    });

    it('should render with responsive container classes', () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      const container = screen.getByTestId('video-character-container');
      expect(container).toHaveClass('relative', 'w-full', 'h-full', 'overflow-hidden');
    });

    it('should render loading state initially', () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      expect(screen.getByTestId('video-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading character...')).toBeInTheDocument();
    });
  });

  describe('Video Loading', () => {
    it('should load video source from VideoCharacterService', async () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      await waitFor(() => {
        expect(mockVideoService.getVideoPath).toHaveBeenCalledWith('test-character', undefined);
      });

      const videoElement = screen.getByTestId('character-video') as HTMLVideoElement;
      expect(videoElement.src).toContain('/video/chilling.mp4');
    });

    it('should preload video when component mounts', async () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      await waitFor(() => {
        expect(mockVideoService.preloadVideo).toHaveBeenCalledWith('/video/chilling.mp4');
      });
    });

    it('should hide loading state when video is ready', async () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      const videoElement = screen.getByTestId('character-video');

      // Simulate video loaded
      fireEvent.loadedData(videoElement);

      await waitFor(() => {
        expect(screen.queryByTestId('video-loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('Video Playback Control', () => {
    it('should auto-play video when loaded', async () => {
      render(<VideoCharacterDisplay characterId="test-character" autoPlay={true} />);

      const videoElement = screen.getByTestId('character-video');
      fireEvent.loadedData(videoElement);

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalled();
      });
    });

    it('should not auto-play when autoPlay is false', async () => {
      mockPlay.mockClear();

      render(<VideoCharacterDisplay characterId="test-character" autoPlay={false} isPlaying={false} />);

      const videoElement = screen.getByTestId('character-video');
      fireEvent.loadedData(videoElement);

      await waitFor(() => {
        expect(mockPlay).not.toHaveBeenCalled();
      });
    });

    it('should pause video when pause method is called', async () => {
      const { rerender } = render(<VideoCharacterDisplay characterId="test-character" />);

      // First load the video
      const videoElement = screen.getByTestId('character-video');
      fireEvent.loadedData(videoElement);

      await waitFor(() => {
        expect(screen.queryByTestId('video-loading')).not.toBeInTheDocument();
      });

      // Then simulate external pause call
      rerender(<VideoCharacterDisplay characterId="test-character" isPlaying={false} />);

      await waitFor(() => {
        expect(mockPause).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when video fails to load', async () => {
      mockVideoService.getVideoPath.mockImplementation(() => {
        throw new Error('Video not found');
      });

      render(<VideoCharacterDisplay characterId="invalid-character" />);

      await waitFor(() => {
        expect(screen.getByTestId('video-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load character video')).toBeInTheDocument();
      });
    });

    it('should handle video playback errors gracefully', async () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      const videoElement = screen.getByTestId('character-video');

      // Simulate video error
      fireEvent.error(videoElement);

      await waitFor(() => {
        expect(screen.getByTestId('video-error')).toBeInTheDocument();
      });
    });

    it('should retry loading video on error', async () => {
      const mockLoad = jest.fn();
      HTMLMediaElement.prototype.load = mockLoad;

      render(<VideoCharacterDisplay characterId="test-character" />);

      const videoElement = screen.getByTestId('character-video');
      fireEvent.error(videoElement);

      const retryButton = screen.getByTestId('video-retry-button');
      fireEvent.click(retryButton);

      expect(mockLoad).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should maintain aspect ratio in different container sizes', () => {
      render(<VideoCharacterDisplay characterId="test-character" aspectRatio="16:9" />);

      const videoElement = screen.getByTestId('character-video');
      expect(videoElement).toHaveClass('aspect-video');
    });

    it('should apply custom aspect ratio', () => {
      render(<VideoCharacterDisplay characterId="test-character" aspectRatio="4:3" />);

      const videoElement = screen.getByTestId('character-video');
      // Check if the style attribute contains the aspect-ratio
      expect(videoElement.style.aspectRatio).toBe('4/3');
    });

    it('should be responsive to container size changes', () => {
      render(<VideoCharacterDisplay characterId="test-character" />);

      const container = screen.getByTestId('video-character-container');
      expect(container).toHaveClass('w-full', 'h-full');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track video loading performance', async () => {
      const performanceCallback = jest.fn();

      render(
        <VideoCharacterDisplay
          characterId="test-character"
          onPerformanceMetrics={performanceCallback}
        />
      );

      const videoElement = screen.getByTestId('character-video');
      fireEvent.loadedData(videoElement);

      await waitFor(() => {
        expect(performanceCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            loadTime: expect.any(Number),
            videoSize: expect.any(Number),
          })
        );
      });
    });

    it('should monitor memory usage during playback', async () => {
      const memoryCallback = jest.fn();

      render(
        <VideoCharacterDisplay
          characterId="test-character"
          onMemoryUsage={memoryCallback}
        />
      );

      // Simulate memory monitoring
      await waitFor(() => {
        expect(memoryCallback).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });
});