import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the electron API
Object.defineProperty(window, "electronAPI", {
  value: {
    getAppVersion: jest.fn().mockResolvedValue("1.0.0"),
    getPlatform: jest.fn().mockResolvedValue("darwin"),
  },
  writable: true,
});

describe("App", () => {
  test("renders welcome message", () => {
    render(<App />);
    expect(screen.getByText("Virtual Character App")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to Your Virtual Character Desktop App")
    ).toBeInTheDocument();
  });

  test("displays app information when running in Electron", async () => {
    render(<App />);
    
    // Wait for the async calls to complete
    await screen.findByText("App Version: 1.0.0");
    expect(screen.getByText("Platform: darwin")).toBeInTheDocument();
  });
});