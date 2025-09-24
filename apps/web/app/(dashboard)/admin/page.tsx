import { Card } from '@build/ui';

export default function AdminPage() {
  const rows = [
    { name: 'Constructora Atlántico', role: 'Buyer' },
    { name: 'Instaladora Levante', role: 'Vendor' },
    { name: 'Administrador General', role: 'OrgAdmin' }
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Administración</h2>
      <Card>
        <h3 className="mb-2 text-lg font-semibold">Empresas y roles</h3>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-slate-500">
              <th className="py-2">Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0">
                <td className="py-2">{row.name}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
