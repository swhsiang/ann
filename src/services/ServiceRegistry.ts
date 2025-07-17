import { container, ServiceTokens } from './container/ServiceContainer';

// Placeholder interfaces for services that will be implemented later
interface PlaceholderService {
  readonly _placeholder: true;
}

/**
 * Service Registry for configuring and initializing all application services
 * This follows the TDD principle of dependency injection for testability
 */
export class ServiceRegistry {
  private static isInitialized = false;

  /**
   * Initialize all services with their dependencies
   * This method should be called once during application startup
   */
  static initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Register core services as singletons
    this.registerCoreServices();
    
    // Register sensor services
    this.registerSensorServices();
    
    // Register AI processing services
    this.registerAIServices();
    
    // Register business logic services
    this.registerBusinessServices();
    
    // Register storage services
    this.registerStorageServices();

    this.isInitialized = true;
  }

  /**
   * Reset the service registry (useful for testing)
   */
  static reset(): void {
    container.clear();
    this.isInitialized = false;
  }

  /**
   * Check if services are initialized
   */
  static get initialized(): boolean {
    return this.isInitialized;
  }

  private static registerCoreServices(): void {
    // Event Bus - Central communication hub
    container.registerSingleton(ServiceTokens.EVENT_BUS, (): PlaceholderService => {
      // Will be implemented in task 3
      return { _placeholder: true }; // Placeholder
    });

    // Error Handler - Global error management
    container.registerSingleton(ServiceTokens.ERROR_HANDLER, (): PlaceholderService => {
      // Will be implemented in task 10
      return { _placeholder: true }; // Placeholder
    });
  }

  private static registerSensorServices(): void {
    // Microphone Sensor
    container.registerSingleton(ServiceTokens.MICROPHONE_SENSOR, (): PlaceholderService => {
      // Will be implemented in task 3
      return { _placeholder: true }; // Placeholder
    });

    // Text Input Sensor
    container.registerSingleton(ServiceTokens.TEXT_INPUT_SENSOR, (): PlaceholderService => {
      // Will be implemented in task 3
      return { _placeholder: true }; // Placeholder
    });

    // File Upload Sensor
    container.registerSingleton(ServiceTokens.FILE_UPLOAD_SENSOR, (): PlaceholderService => {
      // Will be implemented in task 3
      return { _placeholder: true }; // Placeholder
    });
  }

  private static registerAIServices(): void {
    // OpenAI Service
    container.registerSingleton(ServiceTokens.OPENAI_SERVICE, (): PlaceholderService => {
      // Will be implemented in task 4
      return { _placeholder: true }; // Placeholder
    });

    // Emotion Processor
    container.registerSingleton(ServiceTokens.EMOTION_PROCESSOR, (): PlaceholderService => {
      // Will be implemented in task 4
      return { _placeholder: true }; // Placeholder
    });

    // Intent Processor
    container.registerSingleton(ServiceTokens.INTENT_PROCESSOR, (): PlaceholderService => {
      // Will be implemented in task 4
      return { _placeholder: true }; // Placeholder
    });
  }

  private static registerBusinessServices(): void {
    // File Validator
    container.registerSingleton(ServiceTokens.FILE_VALIDATOR, (): PlaceholderService => {
      // Will be implemented in task 2
      return { _placeholder: true }; // Placeholder
    });

    // File Storage Service
    container.registerSingleton(ServiceTokens.FILE_STORAGE_SERVICE, (): PlaceholderService => {
      // Will be implemented in task 2
      return { _placeholder: true }; // Placeholder
    });

    // Character Generation Service
    container.registerSingleton(ServiceTokens.CHARACTER_GENERATION_SERVICE, (): PlaceholderService => {
      // Will be implemented in task 5
      return { _placeholder: true }; // Placeholder
    });

    // Character Service
    container.registerSingleton(ServiceTokens.CHARACTER_SERVICE, (): PlaceholderService => {
      // Will be implemented in task 5
      return { _placeholder: true }; // Placeholder
    });

    // Conversation Service
    container.registerSingleton(ServiceTokens.CONVERSATION_SERVICE, (): PlaceholderService => {
      // Will be implemented in task 7
      return { _placeholder: true }; // Placeholder
    });
  }

  private static registerStorageServices(): void {
    // Character Repository
    container.registerSingleton(ServiceTokens.CHARACTER_REPOSITORY, (): PlaceholderService => {
      // Will be implemented in task 8
      return { _placeholder: true }; // Placeholder
    });
  }
}

/**
 * Helper function to get a service from the container
 * Provides type safety and ensures services are initialized
 */
export function getService<T>(token: string): T {
  if (!ServiceRegistry.initialized) {
    ServiceRegistry.initialize();
  }
  return container.resolve<T>(token);
}