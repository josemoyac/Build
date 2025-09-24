import Link from 'next/link';
import { PrimaryButton } from '@build/ui';

export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">Centraliza tus licitaciones</h2>
        <p className="text-lg text-slate-600">
          Build permite a constructoras y subcontratistas colaborar de forma segura, importar presupuestos BC3 y evaluar
          ofertas con transparencia total.
        </p>
        <div className="flex gap-4">
          <Link href="/tenders">
            <PrimaryButton>Ver licitaciones</PrimaryButton>
          </Link>
          <Link className="rounded-md border border-primary px-4 py-2 font-semibold text-primary" href="/login">
            Acceder
          </Link>
        </div>
      </section>
      <section className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-semibold">Próxima fecha clave</h3>
        <p className="text-sm text-slate-500">Apertura de sobres: 15/04/2024 10:00</p>
        <p className="mt-4 text-sm text-slate-500">
          Recibirás un correo y una notificación en la plataforma con el acta de apertura.
        </p>
      </section>
    </div>
  );
}
