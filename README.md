# Virtual Character App

An Electron desktop application for creating and interacting with virtual characters, built with React, TypeScript, and a test-driven development approach.

## Features

- **Electron + React + TypeScript**: Modern desktop application stack
- **Test-Driven Development**: Comprehensive unit and integration tests with Jest
- **End-to-End Testing**: Playwright for E2E testing
- **Dependency Injection**: Service container for testable architecture
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Type Safety**: Full TypeScript support with strict configuration

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- yarn

### Installation

```bash
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

This will start both the Vite development server and Electron in development mode.

### Testing

Run unit tests:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

Run E2E tests:

```bash
yarn test:e2e
```

### Building

Build for production:

```bash
yarn build
```

Start the production build:

```bash
yarn start:prod
```

### Type Checking

Run TypeScript type checking:

```bash
yarn type-check
```

## Architecture

### Service Container

The application uses a dependency injection container for managing services:

- **ServiceContainer**: Core DI container implementation
- **ServiceRegistry**: Centralized service registration and initialization
- **Service Tokens**: Type-safe service identifiers

### Testing Strategy

- **Unit Tests**: Individual service and component testing
- **Integration Tests**: Service interaction testing
- **E2E Tests**: Full application workflow testing
- **Mocking**: Electron API mocking for renderer process tests

### Project Structure

```
src/
├── components/          # React components
├── services/           # Business logic services
│   ├── container/      # Dependency injection container
│   └── __tests__/      # Service tests
├── types/              # TypeScript type definitions
└── lib/                # Utility functions

electron/               # Electron main process
├── main.ts            # Main process entry point
├── preload.ts         # Preload script
└── utils.ts           # Electron utilities

tests/
└── e2e/               # End-to-end tests
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run unit tests
- `yarn test:e2e` - Run E2E tests
- `yarn type-check` - Run TypeScript type checking
- `yarn lint` - Run ESLint

## Technologies Used

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Jest**: Unit testing framework
- **Playwright**: E2E testing framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library