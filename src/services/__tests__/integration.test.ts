import { ServiceRegistry, getService } from '../ServiceRegistry';
import { ServiceTokens } from '../container/ServiceContainer';

describe('Service Integration', () => {
  beforeEach(() => {
    ServiceRegistry.reset();
  });

  afterEach(() => {
    ServiceRegistry.reset();
  });

  it('should initialize and provide all required services', () => {
    // Initialize the service registry
    ServiceRegistry.initialize();

    // Verify all services can be resolved
    const services = [
      ServiceTokens.EVENT_BUS,
      ServiceTokens.ERROR_HANDLER,
      ServiceTokens.MICROPHONE_SENSOR,
      ServiceTokens.TEXT_INPUT_SENSOR,
      ServiceTokens.FILE_UPLOAD_SENSOR,
      ServiceTokens.OPENAI_SERVICE,
      ServiceTokens.EMOTION_PROCESSOR,
      ServiceTokens.INTENT_PROCESSOR,
      ServiceTokens.FILE_VALIDATOR,
      ServiceTokens.FILE_STORAGE_SERVICE,
      ServiceTokens.CHARACTER_GENERATION_SERVICE,
      ServiceTokens.CHARACTER_SERVICE,
      ServiceTokens.CONVERSATION_SERVICE,
      ServiceTokens.CHARACTER_REPOSITORY
    ];

    services.forEach(serviceToken => {
      expect(() => getService(serviceToken)).not.toThrow();
      const service = getService(serviceToken);
      expect(service).toBeDefined();
    });
  });

  it('should maintain singleton behavior across service calls', () => {
    const eventBus1 = getService(ServiceTokens.EVENT_BUS);
    const eventBus2 = getService(ServiceTokens.EVENT_BUS);
    
    expect(eventBus1).toBe(eventBus2);
  });

  it('should auto-initialize when getService is called', () => {
    expect(ServiceRegistry.initialized).toBe(false);
    
    getService(ServiceTokens.EVENT_BUS);
    
    expect(ServiceRegistry.initialized).toBe(true);
  });
});