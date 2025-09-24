'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Card } from '@build/ui';

interface TenderDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  chapters: { code: string; name: string; items: { code: string; name: string; quantity: number; unit: string; price: number }[] }[];
}

export default function TenderDetailPage() {
  const params = useParams();
  const [data, setData] = useState<TenderDetail | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tenders/${params.id}`)
      .then((response) => setData(response.data))
      .catch(() => setData(null));
  }, [params]);

  if (!data) {
    return <p className="text-sm text-slate-500">Cargando licitación...</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-2xl font-semibold">{data.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{data.description}</p>
        <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{data.status}</span>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Capítulos y partidas</h3>
        <div className="space-y-6">
          {data.chapters.map((chapter) => (
            <section key={chapter.code}>
              <h4 className="font-semibold text-primary">{chapter.code} - {chapter.name}</h4>
              <table className="mt-2 w-full table-auto text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-slate-500">
                    <th className="py-2">Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {chapter.items.map((item) => (
                    <tr key={item.code} className="border-b last:border-0">
                      <td className="py-2 font-mono">{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}
