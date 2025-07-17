import { render, screen, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react";
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
  test("renders welcome message", async () => {
    await act(async () => {
      render(<App />);
    });
    
    expect(screen.getByText("Virtual Character App")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to your Ann AI desktop application built with Electron, React, and TypeScript.")
    ).toBeInTheDocument();
  });

  test("displays app information when running in Electron", async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for the async calls to complete
    await waitFor(() => {
      expect(screen.getByText(/App Version:/)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Platform:/)).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
    expect(screen.getByText("darwin")).toBeInTheDocument();
  });

  test("renders without electron API", async () => {
    // Temporarily remove the electron API
    const originalElectronAPI = window.electronAPI;
    delete (window as any).electronAPI;
    
    await act(async () => {
      render(<App />);
    });
    
    expect(screen.getByText("Virtual Character App")).toBeInTheDocument();
    expect(screen.getByText("Get Started - 1")).toBeInTheDocument();
    expect(screen.getByText("Learn More")).toBeInTheDocument();
    
    // Restore the electron API
    window.electronAPI = originalElectronAPI;
  });
});