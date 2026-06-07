import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
  type ReactNode,
} from 'react';
import { authStore } from './store';
import type { AuthAdapter, AuthSession, AuthUser } from './types';

/**
 * Types
 */

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  adapter: AuthAdapter;
  children: ReactNode;
}

/**
 * Constants
 */

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider
 */

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  adapter,
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    adapter
      .getSession()
      .then((initialSession: AuthSession) => {
        if (cancelled) {
          return;
        }

        setSession(initialSession);
        setUser(initialSession.user);
        authStore.setUser(initialSession.user);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setIsLoading(false);
      });

    const unsubscribe = adapter.onAuthStateChange(
      (updatedSession: AuthSession | null) => {
        if (cancelled) {
          return;
        }

        const newUser = updatedSession?.user ?? null;

        setSession(
          updatedSession ?? {
            user: null,
            accessToken: null,
          }
        );
        setUser(newUser);
        authStore.setUser(newUser);
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [adapter]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      setError(null);

      try {
        const result = await adapter.signIn(email, password);

        setSession(result);
        setUser(result.user);
        authStore.setUser(result.user);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';

        setError(message);
        throw err;
      }
    },
    [adapter]
  );

  const signOut = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      await adapter.signOut();
      setUser(null);
      setSession({
        user: null,
        accessToken: null,
      });
      authStore.setUser(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';

      setError(message);
      throw err;
    }
  }, [adapter]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      error,
      signIn,
      signOut,
    }),
    [user, session, isLoading, error, signIn, signOut]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth
 */

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * useUser
 */

export const useUser = (): AuthUser | null => useAuth().user;

/**
 * useSignIn
 */

export const useSignIn = (): ((
  email: string,
  password: string
) => Promise<void>) => useAuth().signIn;

/**
 * useSignOut
 */

export const useSignOut = (): (() => Promise<void>) => useAuth().signOut;
