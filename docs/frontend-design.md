# Frontend Design Guidelines

## Modern React + Tailwind Pattern: Minimal CSS + Utility-First

### Core Philosophy

**Tailwind IS CSS-in-JS (but better)** - utilities are co-located with components, build-time purged, with no runtime overhead.

### Recommended File Structure

```
project-root/
├── public/                   # Static assets (Vite convention)
│   ├── video/               # Video assets for virtual characters
│   │   ├── cheer-leader.mp4 # Positive emotion videos
│   │   ├── dancing.mp4      # Character animations
│   │   ├── chilling.mp4     # Neutral/idle videos
│   │   ├── yah.mp4          # Celebration videos
│   │   └── negative/        # Negative emotion videos
│   │       └── angry.mp4
│   └── favicon.ico          # Other static assets
├── src/
│   ├── index.css            # ONLY global styles, Tailwind directives, CSS variables
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Main app component
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (pure Tailwind utilities)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── character/       # Video character display components
│   │   │   ├── VideoCharacterDisplay.tsx    # Main video display component
│   │   │   ├── VideoCharacterDemo.tsx       # Demo/example component
│   │   │   └── __tests__/                   # TDD test files
│   │   │       └── VideoCharacterDisplay.test.tsx
│   │   └── custom/          # Your custom components (pure Tailwind utilities)
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── lib/                 # Utility functions, cn() helper
│   ├── services/            # API services, business logic
│   │   ├── character/       # Character-related services
│   │   │   └── VideoCharacterService.ts     # Video management service
│   │   └── container/       # Dependency injection
│   └── types/               # TypeScript type definitions
├── electron/                # Electron main process files
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Preload scripts
│   └── utils.ts             # Electron utilities
└── dist/                    # Build output
    ├── renderer/            # React app build (from public/ + src/)
    └── main/                # Electron main process build
```

### Modern Styling Approach

**✅ Recommended: Minimal CSS + Utility-First**

```tsx
// Single CSS file (src/index.css) ONLY for:
// - @tailwind directives
// - CSS custom properties
// - Global base styles

// Everything else in JSX with utilities:
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition-colors">
  Click me
</button>

// For complex variants, use cva():
import { cva } from "class-variance-authority";

const buttonVariants = cva("px-4 py-2 rounded-lg font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      destructive: "bg-red-500 hover:bg-red-600 text-white"
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    }
  }
});
```

**❌ Avoid: Traditional CSS-in-JS**

```tsx
// Don't do this with Tailwind:
const StyledButton = styled.button`
  background: blue;
  padding: 8px 16px;
  &:hover { background: darkblue; }
`;

// Don't create separate CSS files for components:
import './Button.css'  // ❌ Avoid
import styles from './Button.module.css'  // ❌ Usually unnecessary
```

### Why This Pattern?

**Performance Benefits:**
- No runtime style injection overhead
- Smaller JavaScript bundles (20-30% improvement)
- Build-time purging (only used utilities included)
- Better caching (CSS cached separately)
- Faster hydration in SSR

**Developer Experience:**
- Co-located styling with components
- No context switching between files
- Excellent TypeScript support with `cn()` utility
- Consistent design system through utilities

### Industry Adoption

- **Vercel/Next.js**: Uses this pattern
- **GitHub**: Migrated away from CSS-in-JS to utilities
- **Shopify**: Utility-first approach
- **shadcn/ui**: Built entirely on this pattern

### CSS Variable Management

All CSS custom properties should be defined in `src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    /* ... other variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode overrides */
  }
}
```

This approach ensures:
- Consistent theming across the application
- Easy dark/light mode switching
- Centralized color management
- Compatibility with shadcn/ui components

## HTML5 Video Character Display System

### Architecture Overview

The video character display system follows a **TDD-driven, component-based architecture** with clean separation of concerns:

```tsx
// Service Layer (Business Logic)
VideoCharacterService → Video management, emotion mapping, preloading
ServiceContainer → Dependency injection for testability

// Component Layer (Presentation)
VideoCharacterDisplay → Main video display with cross-fade transitions
VideoCharacterDemo → Usage example and demo component

// Test Layer (Quality Assurance)
VideoCharacterDisplay.test.tsx → Comprehensive test suite (17 tests)
```

### Key Implementation Features

**✅ HTML5 Video with Advanced Capabilities:**

```tsx
// Dual video cross-fade system for smooth transitions
<video ref={video1Ref} className="active transition-opacity duration-500" />
<video ref={video2Ref} className="opacity-0 transition-opacity duration-500" />

// Emotion-based video selection
const emotionMappings = {
  positive: ['/video/cheer-leader.mp4', '/video/dancing.mp4'],
  negative: ['/video/negative/angry.mp4'],
  neutral: ['/video/chilling.mp4', '/video/video-3d-model.mp4']
};
```

**✅ Performance Optimizations:**

```tsx
// Video preloading for smooth playback
await videoService.preloadVideo(videoPath);

// Performance metrics collection
interface VideoMetrics {
  loadTime: number;
  videoSize: number;
  playbackQuality: 'high' | 'medium' | 'low';
}

// Memory usage monitoring
useEffect(() => {
  const interval = setInterval(() => {
    const usage = (performance as any).memory?.usedJSHeapSize || 0;
    onMemoryUsage(usage);
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

**✅ Error Handling & Recovery:**

```tsx
// Comprehensive error handling with retry mechanisms
const handleVideoError = useCallback((error: Event) => {
  setVideoState(prev => ({
    ...prev,
    hasError: true,
    errorMessage: 'Failed to load character video'
  }));
  onError?.(new Error('Failed to load character video'));
}, [onError]);

// Retry functionality
const retryLoading = useCallback(() => {
  if (activeVideoRef.current) {
    activeVideoRef.current.load();
  }
}, []);
```

### TDD Implementation Pattern

**✅ Test-Driven Development Approach:**

```tsx
// 1. RED: Write failing test first
it('should auto-play video when loaded', async () => {
  render(<VideoCharacterDisplay characterId="test-character" autoPlay={true} />);
  const videoElement = screen.getByTestId('character-video');
  fireEvent.loadedData(videoElement);
  
  await waitFor(() => {
    expect(mockPlay).toHaveBeenCalled();
  });
});

// 2. GREEN: Implement minimal code to pass
const handleVideoLoaded = useCallback((videoElement: HTMLVideoElement) => {
  if (autoPlay && isPlaying) {
    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(console.error);
    }
  }
}, [autoPlay, isPlaying]);

// 3. REFACTOR: Improve code quality while keeping tests green
```

**✅ Comprehensive Test Coverage:**

```tsx
// Component Rendering Tests
✓ should render video element with correct attributes
✓ should render with responsive container classes
✓ should render loading state initially

// Video Loading Tests  
✓ should load video source from VideoCharacterService
✓ should preload video when component mounts
✓ should hide loading state when video is ready

// Video Playback Control Tests
✓ should auto-play video when loaded
✓ should not auto-play when autoPlay is false
✓ should pause video when pause method is called

// Error Handling Tests
✓ should display error message when video fails to load
✓ should handle video playback errors gracefully
✓ should retry loading video on error

// Responsive Design Tests
✓ should maintain aspect ratio in different container sizes
✓ should apply custom aspect ratio
✓ should be responsive to container size changes

// Performance Monitoring Tests
✓ should track video loading performance
✓ should monitor memory usage during playback
```

### Component Usage Examples

**✅ Basic Usage:**

```tsx
import { VideoCharacterDisplay } from '@/components/character/VideoCharacterDisplay';

function MyApp() {
  return (
    <div className="w-full h-96">
      <VideoCharacterDisplay 
        characterId="my-character"
        autoPlay={true}
        aspectRatio="16:9"
      />
    </div>
  );
}
```

**✅ Advanced Usage with Emotion Control:**

```tsx
function InteractiveCharacter() {
  const [emotion, setEmotion] = useState<string>('neutral');
  const [metrics, setMetrics] = useState<VideoMetrics | null>(null);

  return (
    <div className="space-y-4">
      {/* Emotion Controls */}
      <div className="flex gap-2">
        <button 
          onClick={() => setEmotion('positive')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Happy
        </button>
        <button 
          onClick={() => setEmotion('negative')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Angry
        </button>
      </div>

      {/* Video Character */}
      <VideoCharacterDisplay
        characterId="interactive-character"
        emotion={emotion}
        onPerformanceMetrics={setMetrics}
        onError={(error) => console.error('Video error:', error)}
      />

      {/* Performance Display */}
      {metrics && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Load Time: {metrics.loadTime}ms</p>
          <p>Quality: {metrics.playbackQuality}</p>
        </div>
      )}
    </div>
  );
}
```

### CSS Transitions for Video Cross-Fade

**✅ Minimal CSS for Smooth Transitions:**

```css
/* src/index.css - ONLY place for custom CSS */
.video-character-container video.active {
  opacity: 1;
  z-index: 1;
}

.video-character-container video:not(.active) {
  opacity: 0;
  z-index: 0;
}

.video-character-container video {
  transition: opacity 0.5s ease-in-out;
}
```

### Service Layer Architecture

**✅ Dependency Injection for Testability:**

```tsx
// VideoCharacterService interface for easy mocking
export interface VideoCharacterService {
  getVideoPath(characterId: string, emotion?: string): string;
  preloadVideo(videoPath: string): Promise<void>;
  getAvailableVideos(characterId: string): string[];
  getVideoByEmotion(emotion: string): string;
}

// Implementation with emotion mapping
export class VideoCharacterServiceImpl implements VideoCharacterService {
  private emotionMappings: EmotionVideoMapping = {
    positive: ['/video/cheer-leader.mp4', '/video/dancing.mp4'],
    negative: ['/video/negative/angry.mp4'],
    neutral: ['/video/chilling.mp4']
  };

  getVideoByEmotion(emotion: string): string {
    const videos = this.emotionMappings[emotion] || this.emotionMappings.neutral;
    return videos[Math.floor(Math.random() * videos.length)];
  }
}
```

### Best Practices Demonstrated

**✅ Modern React Patterns:**
- TypeScript interfaces for type safety
- Custom hooks for reusable logic
- useCallback for performance optimization
- Proper cleanup in useEffect
- Error boundaries for graceful failures

**✅ Performance Optimizations:**
- Video preloading for smooth transitions
- Memory usage monitoring
- Efficient re-renders with React.memo
- Build-time CSS purging with Tailwind

**✅ Accessibility:**
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

This implementation serves as a reference for building complex, performant, and well-tested React components following modern best practices.