/**
 * Dependency Injection Container for managing service instances
 * Supports singleton and transient service registration
 */
export interface ServiceContainer {
  register<T>(token: string, implementation: T): void;
  registerSingleton<T>(token: string, factory: () => T): void;
  registerTransient<T>(token: string, factory: () => T): void;
  resolve<T>(token: string): T;
  isRegistered(token: string): boolean;
  clear(): void;
}

export class ServiceContainerImpl implements ServiceContainer {
  private services = new Map<string, any>();
  private singletons = new Map<string, () => any>();
  private transients = new Map<string, () => any>();
  private singletonInstances = new Map<string, any>();

  register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation);
  }

  registerSingleton<T>(token: string, factory: () => T): void {
    this.singletons.set(token, factory);
  }

  registerTransient<T>(token: string, factory: () => T): void {
    this.transients.set(token, factory);
  }

  resolve<T>(token: string): T {
    // Check for direct service registration first
    if (this.services.has(token)) {
      return this.services.get(token) as T;
    }

    // Check for singleton
    if (this.singletons.has(token)) {
      if (!this.singletonInstances.has(token)) {
        const factory = this.singletons.get(token)!;
        this.singletonInstances.set(token, factory());
      }
      return this.singletonInstances.get(token) as T;
    }

    // Check for transient
    if (this.transients.has(token)) {
      const factory = this.transients.get(token)!;
      return factory() as T;
    }

    throw new Error(`Service '${token}' is not registered`);
  }

  isRegistered(token: string): boolean {
    return this.services.has(token) || 
           this.singletons.has(token) || 
           this.transients.has(token);
  }

  clear(): void {
    this.services.clear();
    this.singletons.clear();
    this.transients.clear();
    this.singletonInstances.clear();
  }
}

// Global container instance
export const container = new ServiceContainerImpl();

// Service tokens for type safety
export const ServiceTokens = {
  EVENT_BUS: 'EventBus',
  OPENAI_SERVICE: 'OpenAIService',
  CHARACTER_SERVICE: 'CharacterService',
  FILE_VALIDATOR: 'FileValidator',
  FILE_STORAGE_SERVICE: 'FileStorageService',
  MICROPHONE_SENSOR: 'MicrophoneSensor',
  TEXT_INPUT_SENSOR: 'TextInputSensor',
  FILE_UPLOAD_SENSOR: 'FileUploadSensor',
  EMOTION_PROCESSOR: 'EmotionProcessor',
  INTENT_PROCESSOR: 'IntentProcessor',
  CHARACTER_GENERATION_SERVICE: 'CharacterGenerationService',
  CONVERSATION_SERVICE: 'ConversationService',
  CHARACTER_REPOSITORY: 'CharacterRepository',
  ERROR_HANDLER: 'ErrorHandler'
} as const;

export type ServiceToken = typeof ServiceTokens[keyof typeof ServiceTokens];