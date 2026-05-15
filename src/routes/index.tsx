import { useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

/**
 * Home
 */

export const Home: FunctionComponent = () => {
  const [isChecked, setIsChecked] = useState(() => localStorage.getItem('is_authenticated') === 'true');
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/' });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    <main className="page-wrap py-20">
      <button
        onClick={handleLogin}
        className="inline-block px-6 py-3 bg-primary bg-primary-container text-on-primary-container font-semibold"
      >
        Entrar
      </button>

      <label className="flex items-center gap-3 mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-foreground">Mantener sesión iniciada</span>
      </label>
    </main>
  );
};

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),
  component: Home,
});