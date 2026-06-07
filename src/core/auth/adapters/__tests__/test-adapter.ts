import type { AuthAdapter, AuthSession, AuthUser } from '../../types';
import { AuthError } from '../../types';

const syncThenable = <T>(value: T): Promise<T> => {
  const thenable = {
    then: (resolve: (val: T) => T | PromiseLike<T>) => {
      const resolved = resolve(value);

      return syncThenable(resolved as T);
    },

    catch: () => thenable,
  };

  return thenable as unknown as Promise<T>;
};

export const createTestAuthAdapter = (
  initialUser: AuthUser | null = null
): AuthAdapter => {
  const currentUser = initialUser;
  const session: AuthSession = {
    user: currentUser,
    accessToken: 'test-token',
  };

  return {
    signIn: async (email: string, password: string) => {
      if (password === 'wrong') {
        throw new AuthError('Invalid credentials');
      }

      const user: AuthUser = {
        id: '1',
        email,
      };

      return {
        user,
        accessToken: 'test-token',
      };
    },

    signOut: async () => {},

    getSession: () => syncThenable(session),

    getUser: () => syncThenable(currentUser),

    onAuthStateChange: () => () => {},
  };
};
