import { ServiceRegistry, getService } from '../ServiceRegistry';
import { container, ServiceTokens } from '../container/ServiceContainer';

describe('ServiceRegistry', () => {
  beforeEach(() => {
    ServiceRegistry.reset();
  });

  afterEach(() => {
    ServiceRegistry.reset();
  });

  describe('Initialization', () => {
    it('should initialize services only once', () => {
      expect(ServiceRegistry.initialized).toBe(false);
      
      ServiceRegistry.initialize();
      expect(ServiceRegistry.initialized).toBe(true);
      
      // Should not reinitialize
      ServiceRegistry.initialize();
      expect(ServiceRegistry.initialized).toBe(true);
    });

    it('should register all core service tokens', () => {
      ServiceRegistry.initialize();
      
      // Check that all service tokens are registered
      expect(container.isRegistered(ServiceTokens.EVENT_BUS)).toBe(true);
      expect(container.isRegistered(ServiceTokens.ERROR_HANDLER)).toBe(true);
      expect(container.isRegistered(ServiceTokens.MICROPHONE_SENSOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.TEXT_INPUT_SENSOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.FILE_UPLOAD_SENSOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.OPENAI_SERVICE)).toBe(true);
      expect(container.isRegistered(ServiceTokens.EMOTION_PROCESSOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.INTENT_PROCESSOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.FILE_VALIDATOR)).toBe(true);
      expect(container.isRegistered(ServiceTokens.FILE_STORAGE_SERVICE)).toBe(true);
      expect(container.isRegistered(ServiceTokens.CHARACTER_GENERATION_SERVICE)).toBe(true);
      expect(container.isRegistered(ServiceTokens.CHARACTER_SERVICE)).toBe(true);
      expect(container.isRegistered(ServiceTokens.CONVERSATION_SERVICE)).toBe(true);
      expect(container.isRegistered(ServiceTokens.CHARACTER_REPOSITORY)).toBe(true);
    });
  });

  describe('Reset', () => {
    it('should reset initialization state', () => {
      ServiceRegistry.initialize();
      expect(ServiceRegistry.initialized).toBe(true);
      
      ServiceRegistry.reset();
      expect(ServiceRegistry.initialized).toBe(false);
    });

    it('should clear all registered services', () => {
      ServiceRegistry.initialize();
      expect(container.isRegistered(ServiceTokens.EVENT_BUS)).toBe(true);
      
      ServiceRegistry.reset();
      expect(container.isRegistered(ServiceTokens.EVENT_BUS)).toBe(false);
    });
  });

  describe('getService helper', () => {
    it('should initialize services if not already initialized', () => {
      expect(ServiceRegistry.initialized).toBe(false);
      
      // This should trigger initialization
      const service = getService(ServiceTokens.EVENT_BUS);
      
      expect(ServiceRegistry.initialized).toBe(true);
      expect(service).toBeDefined();
    });

    it('should return the same service instance for singletons', () => {
      const service1 = getService(ServiceTokens.EVENT_BUS);
      const service2 = getService(ServiceTokens.EVENT_BUS);
      
      expect(service1).toBe(service2);
    });

    it('should throw error for unregistered service', () => {
      ServiceRegistry.initialize();
      
      expect(() => getService('UnregisteredService')).toThrow(
        "Service 'UnregisteredService' is not registered"
      );
    });
  });

  describe('Service Registration Structure', () => {
    beforeEach(() => {
      ServiceRegistry.initialize();
    });

    it('should register core services as singletons', () => {
      const eventBus1 = container.resolve(ServiceTokens.EVENT_BUS);
      const eventBus2 = container.resolve(ServiceTokens.EVENT_BUS);
      
      expect(eventBus1).toBe(eventBus2);
    });

    it('should register sensor services as singletons', () => {
      const sensor1 = container.resolve(ServiceTokens.MICROPHONE_SENSOR);
      const sensor2 = container.resolve(ServiceTokens.MICROPHONE_SENSOR);
      
      expect(sensor1).toBe(sensor2);
    });

    it('should register AI services as singletons', () => {
      const processor1 = container.resolve(ServiceTokens.EMOTION_PROCESSOR);
      const processor2 = container.resolve(ServiceTokens.EMOTION_PROCESSOR);
      
      expect(processor1).toBe(processor2);
    });

    it('should register business services as singletons', () => {
      const service1 = container.resolve(ServiceTokens.CHARACTER_SERVICE);
      const service2 = container.resolve(ServiceTokens.CHARACTER_SERVICE);
      
      expect(service1).toBe(service2);
    });

    it('should register storage services as singletons', () => {
      const repo1 = container.resolve(ServiceTokens.CHARACTER_REPOSITORY);
      const repo2 = container.resolve(ServiceTokens.CHARACTER_REPOSITORY);
      
      expect(repo1).toBe(repo2);
    });
  });
});