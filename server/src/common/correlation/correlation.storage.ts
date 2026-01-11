import { AsyncLocalStorage } from 'async_hooks';

/**
 * AsyncLocalStorage allows us to store a "context" (the Correlation ID)
 * that is accessible anywhere in the code during the same asynchronous execution chain.
 */
export const correlationStorage = new AsyncLocalStorage<string>();

/**
 * Helper to get the current Correlation ID from storage.
 * Returns null if called outside of a request context.
 */
export const getCorrelationId = (): string | undefined => {
  return correlationStorage.getStore();
};
