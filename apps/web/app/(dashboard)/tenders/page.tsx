'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface TenderRow {
  id: string;
  title: string;
  zone: string;
  tradeType: string;
  amount: number;
  status: string;
  publishedAt: string;
  buyerCompany: string;
}

export default function TenderListPage() {
  const [rows, setRows] = useState<TenderRow[]>([]);
  const [filter, setFilter] = useState({ zone: '', tradeType: '', status: '' });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tenders`, { params: filter })
      .then((response) => setRows(response.data))
      .catch(() => setRows([]));
  }, [filter]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { headerName: 'Título', field: 'title', flex: 1 },
      { headerName: 'Zona', field: 'zone', filter: 'agTextColumnFilter', flex: 1 },
      { headerName: 'Tipo de obra', field: 'tradeType', flex: 1 },
      { headerName: 'Estado', field: 'status', flex: 1 },
      { headerName: 'Importe', field: 'amount', valueFormatter: (params) => `${params.value?.toLocaleString('es-ES')} €` },
      { headerName: 'Publicada', field: 'publishedAt', flex: 1 },
      { headerName: 'Empresa', field: 'buyerCompany', flex: 1 }
    ],
    []
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Licitaciones disponibles</h2>
      <div className="flex flex-wrap gap-4 rounded-md bg-white p-4 shadow">
        <label className="text-sm">
          Zona
          <input className="mt-1 rounded border p-2" value={filter.zone} onChange={(e) => setFilter({ ...filter, zone: e.target.value })} />
        </label>
        <label className="text-sm">
          Tipo de trabajo
          <input className="mt-1 rounded border p-2" value={filter.tradeType} onChange={(e) => setFilter({ ...filter, tradeType: e.target.value })} />
        </label>
        <label className="text-sm">
          Estado
          <input className="mt-1 rounded border p-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
        </label>
      </div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rows} columnDefs={columnDefs} pagination paginationAutoPageSize suppressCsvExport={false} />
      </div>
    </div>
  );
}
