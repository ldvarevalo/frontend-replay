import type { Repositories } from './types';

/**
 * Helpers
 */

let instance: Repositories | null = null;

/**
 * setRepositories
 */

export const setRepositories = (repos: Repositories): void => {
  instance = repos;
};

/**
 * getRepositories
 */

export const getRepositories = (): Repositories => {
  if (!instance) {
    throw new Error(
      'Repositories not initialized. Call setRepositories() first.'
    );
  }

  return instance;
};
