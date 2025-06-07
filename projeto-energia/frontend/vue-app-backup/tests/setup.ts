import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

// Limpa todos os mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
}); 