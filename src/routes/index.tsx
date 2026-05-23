import { useState, type FunctionComponent } from 'react';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Button } from '#/components/ui/button';

/**
 * Login
 */

const Login: FunctionComponent = () => {
  const [isChecked, setIsChecked] = useState(
    () => localStorage.getItem('is_authenticated') === 'true'
  );
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/' });

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = e.target.checked;
    localStorage.setItem('is_authenticated', String(checked));
    setIsChecked(checked);
  };

  const handleLogin = (): void => {
    localStorage.setItem('is_authenticated', 'true');
    const target = redirect || '/inicio';

    navigate({
      to: target,
      replace: true,
    });
  };

  return (
    <main className="page-wrap space-y-6 py-20">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-foreground">Mantener sesión iniciada</span>
      </label>

      <Button variant="primary" size="lg" onClick={handleLogin}>
        Entrar
      </Button>
    </main>
  );
};

/**
 * Login Route
 */

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),
  component: Login,
});
