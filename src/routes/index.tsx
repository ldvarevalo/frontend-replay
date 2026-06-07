import { type FormEvent, useEffect, type FunctionComponent } from 'react';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useAuth } from '#/core/auth/auth-context';

/**
 * Components
 */

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/' });
  const { signIn, error, user } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      await signIn(email, password);
      const target = redirect || '/inicio';

      await navigate({
        to: target,
        replace: true,
      });
    } catch {
      // error is already set in context by AuthProvider
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const target = redirect || '/inicio';

    navigate({
      to: target,
      replace: true,
    });
  }, [user, redirect, navigate]);

  if (user) {
    return null;
  }

  return (
    <main className="page-wrap space-y-6 py-20">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input type="email" name="email" placeholder="Email" required />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button variant="primary" size="lg" type="submit">
          Entrar
        </Button>
      </form>
    </main>
  );
};

/**
 * IndexRoute
 */

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),
  component: Login,
});
