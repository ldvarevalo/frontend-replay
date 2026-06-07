import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { createTestRepositories } from '#/repositories/__tests__/test-repositories'
import { setRepositories } from '#/repositories/instance'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeEach(() => {
  vi.clearAllMocks()
  setRepositories(createTestRepositories())
})