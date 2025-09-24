import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Build | Plataforma de licitaciones B2B',
  description: 'Gestión integral de licitaciones para construcción'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary"></div>
              <div>
                <h1 className="text-2xl font-bold">Build</h1>
                <p className="text-sm text-slate-500">Portal colaborativo de licitaciones</p>
              </div>
            </div>
            <nav className="hidden gap-4 md:flex">
              <a className="text-sm font-semibold text-primary" href="/tenders">
                Licitaciones
              </a>
              <a className="text-sm font-semibold text-primary" href="/bids">
                Mis ofertas
              </a>
              <a className="text-sm font-semibold text-primary" href="/admin">
                Administración
              </a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
