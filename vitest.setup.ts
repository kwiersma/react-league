import { vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia; react-data-table-component uses it
// (prefers-reduced-motion, export hook) so tests need a stub.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom doesn't implement ResizeObserver either; react-data-table-component uses it
// for its responsive/column-resize behavior.
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserverMock;
