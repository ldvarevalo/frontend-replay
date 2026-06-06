import type { AuthAdapter, AuthUser } from '../../types';
import { AuthError } from '../../types';

export const createTestAuthAdapter = (
  initialUser: AuthUser | null = null
): AuthAdapter => ({
  signIn: async (
    email: string,
    password: string
  ) => {
    if (password === 'wrong') {
      throw new AuthError('Invalid credentials');
    }

    const user: AuthUser = { id: '1', email };

    return { user, accessToken: 'test-token' };
  },

  signOut: async () => {},

  getSession: async () => ({
    user: initialUser,
    accessToken: 'test-token',
  }),

  getUser: async () => initialUser,

  onAuthStateChange: () => () => {},
});
