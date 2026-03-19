// Matchers como toBeVisible, toHaveTextContent vêm built-in no @testing-library/react-native 13+
import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

// Mock AsyncStorage (v3 não inclui jest/async-storage-mock — usa __mocks__)
jest.mock('@react-native-async-storage/async-storage');

// Mock Expo Notifications - Completo com todos os métodos necessários
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  SchedulableTriggerInputTypes: {
    DATE: 'date',
    TIME_INTERVAL: 'timeInterval',
    CALENDAR: 'calendar',
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported (path varies by RN version)
try {
  // React Native <0.80
  require.resolve('react-native/Libraries/Animated/NativeAnimatedHelper');
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch {
  // React Native >=0.80
  jest.mock(
    'react-native/Libraries/Animated/NativeAnimatedTurboModule',
    () => ({})
  );
}

// Suprimir warnings de console esperados nos testes
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suprimir erros esperados relacionados a notificações e animações
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Notifications.getPermissionsAsync') ||
        args[0].includes('An update to Animated') ||
        args[0].includes('act(...)') ||
        args[0].includes('Erro ao buscar') ||
        args[0].includes('Erro ao cancelar notificações') ||
        args[0].includes('notificacoesAgendadas is not iterable'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Suprimir warnings esperados
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Permissão de notificação não concedida') ||
        args[0].includes('act(...)'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
