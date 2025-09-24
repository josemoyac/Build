'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@build/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('buyer@build.test');
  const [password, setPassword] = useState('Build123!');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      localStorage.setItem('build.accessToken', response.data.accessToken);
      router.push('/tenders');
    } catch (err) {
      setError('No se pudo iniciar sesión.');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Acceso a Build</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Correo electrónico
          <input
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Contraseña
          <input
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <PrimaryButton type="submit">Entrar</PrimaryButton>
      </form>
    </div>
  );
}
