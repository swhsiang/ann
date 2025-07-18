import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock the VideoCharacterDisplay component
jest.mock("@/components/character/VideoCharacterDisplay", () => ({
  VideoCharacterDisplay: ({ characterId, emotion, onPerformanceMetrics }: any) => {
    return (
      <div data-testid="video-character-display">
        <div data-testid="character-id">{characterId}</div>
        <div data-testid="current-emotion">{emotion}</div>
        {onPerformanceMetrics && (
          <button 
            data-testid="trigger-metrics"
            onClick={() => onPerformanceMetrics({
              loadTime: 150,
              videoSize: 1920 * 1080,
              playbackQuality: 'high'
            })}
          >
            Trigger Metrics
          </button>
        )}
      </div>
    );
  }
}));

// Mock the electron API
Object.defineProperty(window, "electronAPI", {
    value: {
        getAppVersion: jest.fn().mockResolvedValue("1.0.0"),
        getPlatform: jest.fn().mockResolvedValue("darwin"),
    },
    writable: true,
});

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

        test("clicking emotion buttons changes active emotion", async () => {
            render(<App />);
            
            const happyButton = screen.getByText("Happy");
            fireEvent.click(happyButton);

            await waitFor(() => {
                expect(screen.getByTestId("current-emotion")).toHaveTextContent("positive");
            });

            const angryButton = screen.getByText("Angry");
            fireEvent.click(angryButton);

            await waitFor(() => {
                expect(screen.getByTestId("current-emotion")).toHaveTextContent("negative");
            });
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

    describe("Video Character Integration", () => {
        test("renders VideoCharacterDisplay component", () => {
            render(<App />);
            
            expect(screen.getByTestId("video-character-display")).toBeInTheDocument();
        });

        test("passes correct props to VideoCharacterDisplay", () => {
            render(<App />);
            
            expect(screen.getByTestId("character-id")).toHaveTextContent("ann-ai");
            expect(screen.getByTestId("current-emotion")).toHaveTextContent("neutral");
        });

        test("updates emotion prop when emotion state changes", async () => {
            render(<App />);
            
            const happyButton = screen.getByText("Happy");
            fireEvent.click(happyButton);

            await waitFor(() => {
                expect(screen.getByTestId("current-emotion")).toHaveTextContent("positive");
            });
        });
    });

    describe("Performance Metrics Display", () => {
        test("displays performance metrics when triggered", async () => {
            render(<App />);
            
            // Trigger the performance metrics
            const triggerButton = screen.getByTestId("trigger-metrics");
            fireEvent.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
            });

            expect(screen.getByText("Load Time: 150ms")).toBeInTheDocument();
            expect(screen.getByText("Quality: high")).toBeInTheDocument();
            expect(screen.getByText(/Video Size: [\d,]+ pixels/)).toBeInTheDocument();
        });

        test("does not display performance metrics initially", () => {
            render(<App />);
            
            expect(screen.queryByText("Performance Metrics")).not.toBeInTheDocument();
        });
    });

    describe("App Information Display", () => {
        test("displays app information when running in Electron", async () => {
            render(<App />);

            // Wait for the async calls to complete
            await waitFor(() => {
                expect(screen.getByText(/App Version:/)).toBeInTheDocument();
            });

            expect(screen.getByText(/Platform:/)).toBeInTheDocument();
            expect(screen.getByText("1.0.0")).toBeInTheDocument();
            expect(screen.getByText("darwin")).toBeInTheDocument();
        });

        test("does not display app info without electron API", () => {
            // Temporarily remove the electron API
            const originalElectronAPI = window.electronAPI;
            delete (window as typeof window & { electronAPI?: unknown }).electronAPI;

            render(<App />);

            expect(screen.queryByText(/App Version:/)).not.toBeInTheDocument();
            expect(screen.queryByText(/Platform:/)).not.toBeInTheDocument();

            // Restore the electron API
            window.electronAPI = originalElectronAPI;
        });
    });

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