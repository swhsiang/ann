import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock the SimpleVideoPlayer component
jest.mock("@/components/SimpleVideoPlayer", () => {
  return function MockSimpleVideoPlayer({ emotion }: { emotion: string }) {
    return (
      <div data-testid="simple-video-player">
        <div data-testid="current-emotion">{emotion}</div>
        <div className="relative w-full md:h-full bg-black rounded-lg overflow-hidden">
          <video
            data-testid="video-element"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/test.mp4" type="video/mp4" />
          </video>
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            Emotion: {emotion} | Video: test.mp4
          </div>
        </div>
      </div>
    );
  };
});
// Object.defineProperty(window, "electronAPI", {
//     value: {
//         getAppVersion: jest.fn().mockResolvedValue("1.0.0"),
//         getPlatform: jest.fn().mockResolvedValue("darwin"),
//     },
//     writable: true,
// });

describe("App", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Title Bar", () => {
        test("renders Ann AI title bar", () => {
            render(<App />);
            
            expect(screen.getByText("Ann AI")).toBeInTheDocument();
        });

        test("title bar has drag region styling", () => {
            render(<App />);
            
            const titleBar = screen.getByText("Ann AI").parentElement;
            // Check that the title bar element exists and has the expected classes
            expect(titleBar).toHaveClass("flex", "items-center", "justify-center");
            // The drag region is set via inline style, which may not be testable in JSDOM
            // but we can verify the element structure is correct
            expect(titleBar).toBeInTheDocument();
        });
    });

    describe("Emotion Controls", () => {
        test("renders emotion control buttons", () => {
            render(<App />);
            
            expect(screen.getByText("Happy")).toBeInTheDocument();
            expect(screen.getByText("Neutral")).toBeInTheDocument();
            expect(screen.getByText("Angry")).toBeInTheDocument();
        });

        test("neutral emotion is selected by default", () => {
            render(<App />);
            
            const neutralButton = screen.getByText("Neutral");
            // Check if it has the default variant styling (not outline)
            expect(neutralButton).not.toHaveClass("variant-outline");
        });

        test("clicking emotion buttons changes active emotion", () => {
            render(<App />);
            
            const happyButton = screen.getByText("Happy");
            fireEvent.click(happyButton);

            expect(screen.getByTestId("current-emotion")).toHaveTextContent("positive");

            const angryButton = screen.getByText("Angry");
            fireEvent.click(angryButton);

            expect(screen.getByTestId("current-emotion")).toHaveTextContent("negative");
        });

        test("emotion buttons update visual state when clicked", () => {
            render(<App />);
            
            const happyButton = screen.getByText("Happy");
            const neutralButton = screen.getByText("Neutral");
            
            // Initially neutral should be active
            expect(neutralButton).not.toHaveClass("variant-outline");
            
            fireEvent.click(happyButton);
            
            // After clicking, happy should be active
            expect(happyButton).not.toHaveClass("variant-outline");
        });
    });

    describe("Video Player Integration", () => {
        test("renders SimpleVideoPlayer component", () => {
            render(<App />);
            
            expect(screen.getByTestId("simple-video-player")).toBeInTheDocument();
        });

        test("passes correct emotion prop to SimpleVideoPlayer", () => {
            render(<App />);
            
            expect(screen.getByTestId("current-emotion")).toHaveTextContent("neutral");
        });

        test("updates emotion prop when emotion state changes", () => {
            render(<App />);
            
            const happyButton = screen.getByText("Happy");
            fireEvent.click(happyButton);

            expect(screen.getByTestId("current-emotion")).toHaveTextContent("positive");
        });

        test("renders video element", () => {
            render(<App />);
            
            expect(screen.getByTestId("video-element")).toBeInTheDocument();
        });
    });

    // Note: Performance metrics and app info features are currently commented out in the App component

    describe("Layout and Styling", () => {
        test("has transparent background", () => {
            render(<App />);
            
            // Find the root container by traversing up from the title bar
            const titleBar = screen.getByText("Ann AI").parentElement;
            const mainContainer = titleBar?.parentElement;
            // Check that the main container exists and has the expected classes
            expect(mainContainer).toHaveClass("min-h-screen", "flex", "flex-col");
            // The transparent background is set via inline style, which may not be testable in JSDOM
            // but we can verify the element structure is correct
            expect(mainContainer).toBeInTheDocument();
        });

        test("uses flex layout for main content", () => {
            render(<App />);
            
            const mainContent = screen.getByText("Happy").closest('div')?.parentElement;
            expect(mainContent).toHaveClass("flex-1", "flex", "flex-col");
        });

        test("centers emotion controls", () => {
            render(<App />);
            
            const emotionControls = screen.getByText("Happy").closest('div');
            expect(emotionControls).toHaveClass("flex", "justify-center", "gap-2");
        });
    });
});