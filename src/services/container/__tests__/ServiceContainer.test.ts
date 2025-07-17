import { ServiceContainerImpl, ServiceTokens } from '../ServiceContainer';

describe('ServiceContainer', () => {
  let container: ServiceContainerImpl;

  beforeEach(() => {
    container = new ServiceContainerImpl();
  });

  describe('Direct Service Registration', () => {
    it('should register and resolve a service', () => {
      const mockService = { name: 'test-service' };
      
      container.register('TestService', mockService);
      
      const resolved = container.resolve('TestService');
      expect(resolved).toBe(mockService);
    });

    it('should throw error when resolving unregistered service', () => {
      expect(() => container.resolve('NonExistentService')).toThrow(
        "Service 'NonExistentService' is not registered"
      );
    });
  });

  describe('Singleton Registration', () => {
    it('should register and resolve singleton service', () => {
      let callCount = 0;
      const factory = () => {
        callCount++;
        return { id: callCount };
      };

      container.registerSingleton('SingletonService', factory);
      
      const instance1 = container.resolve('SingletonService');
      const instance2 = container.resolve('SingletonService');
      
      expect(instance1).toBe(instance2);
      expect(callCount).toBe(1);
    });

    it('should create singleton instance only once', () => {
      const mockFactory = jest.fn(() => ({ value: 'singleton' }));
      
      container.registerSingleton('TestSingleton', mockFactory);
      
      container.resolve('TestSingleton');
      container.resolve('TestSingleton');
      container.resolve('TestSingleton');
      
      expect(mockFactory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Transient Registration', () => {
    it('should register and resolve transient service', () => {
      let callCount = 0;
      const factory = () => {
        callCount++;
        return { id: callCount };
      };

      container.registerTransient('TransientService', factory);
      
      const instance1 = container.resolve('TransientService');
      const instance2 = container.resolve('TransientService');
      
      expect(instance1).not.toBe(instance2);
      expect(callCount).toBe(2);
    });

    it('should create new instance on each resolve', () => {
      const mockFactory = jest.fn(() => ({ value: Math.random() }));
      
      container.registerTransient('TestTransient', mockFactory);
      
      container.resolve('TestTransient');
      container.resolve('TestTransient');
      container.resolve('TestTransient');
      
      expect(mockFactory).toHaveBeenCalledTimes(3);
    });
  });

  describe('Service Registration Check', () => {
    it('should return true for registered services', () => {
      container.register('DirectService', {});
      container.registerSingleton('SingletonService', () => ({}));
      container.registerTransient('TransientService', () => ({}));
      
      expect(container.isRegistered('DirectService')).toBe(true);
      expect(container.isRegistered('SingletonService')).toBe(true);
      expect(container.isRegistered('TransientService')).toBe(true);
    });

    it('should return false for unregistered services', () => {
      expect(container.isRegistered('UnregisteredService')).toBe(false);
    });
  });

  describe('Container Clear', () => {
    it('should clear all registered services', () => {
      container.register('DirectService', {});
      container.registerSingleton('SingletonService', () => ({}));
      container.registerTransient('TransientService', () => ({}));
      
      container.clear();
      
      expect(container.isRegistered('DirectService')).toBe(false);
      expect(container.isRegistered('SingletonService')).toBe(false);
      expect(container.isRegistered('TransientService')).toBe(false);
    });

    it('should clear singleton instances', () => {
      let callCount = 0;
      const factory = () => ({ id: ++callCount });
      
      container.registerSingleton('TestSingleton', factory);
      
      const instance1 = container.resolve('TestSingleton');
      container.clear();
      
      container.registerSingleton('TestSingleton', factory);
      const instance2 = container.resolve('TestSingleton');
      
      expect(instance1).not.toBe(instance2);
      expect(callCount).toBe(2);
    });
  });

  describe('Service Tokens', () => {
    it('should have all required service tokens defined', () => {
      expect(ServiceTokens.EVENT_BUS).toBe('EventBus');
      expect(ServiceTokens.OPENAI_SERVICE).toBe('OpenAIService');
      expect(ServiceTokens.CHARACTER_SERVICE).toBe('CharacterService');
      expect(ServiceTokens.FILE_VALIDATOR).toBe('FileValidator');
      expect(ServiceTokens.FILE_STORAGE_SERVICE).toBe('FileStorageService');
      expect(ServiceTokens.MICROPHONE_SENSOR).toBe('MicrophoneSensor');
      expect(ServiceTokens.TEXT_INPUT_SENSOR).toBe('TextInputSensor');
      expect(ServiceTokens.FILE_UPLOAD_SENSOR).toBe('FileUploadSensor');
      expect(ServiceTokens.EMOTION_PROCESSOR).toBe('EmotionProcessor');
      expect(ServiceTokens.INTENT_PROCESSOR).toBe('IntentProcessor');
      expect(ServiceTokens.CHARACTER_GENERATION_SERVICE).toBe('CharacterGenerationService');
      expect(ServiceTokens.CONVERSATION_SERVICE).toBe('ConversationService');
      expect(ServiceTokens.CHARACTER_REPOSITORY).toBe('CharacterRepository');
      expect(ServiceTokens.ERROR_HANDLER).toBe('ErrorHandler');
    });
  });
});