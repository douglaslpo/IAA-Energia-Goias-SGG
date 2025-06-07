import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Setup global test utilities
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}; 