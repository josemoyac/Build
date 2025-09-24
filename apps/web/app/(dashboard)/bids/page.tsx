'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface BidLine {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export default function BidEditorPage() {
  const [rowData, setRowData] = useState<BidLine[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tenders/sample/bid-template`)
      .then((response) => setRowData(response.data.lines))
      .catch(() =>
        setRowData([
          { id: '1', description: 'Losa de cimentación', quantity: 100, unit: 'm2', unitPrice: 0 },
          { id: '2', description: 'Pilares metálicos', quantity: 10, unit: 'ud', unitPrice: 0 }
        ])
      );
  }, []);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { headerName: 'Descripción', field: 'description', editable: true },
      { headerName: 'Cantidad', field: 'quantity', editable: true, valueParser: (params) => Number(params.newValue) },
      { headerName: 'Unidad', field: 'unit', editable: true },
      { headerName: 'Precio unitario', field: 'unitPrice', editable: true, valueParser: (params) => Number(params.newValue) },
      {
        headerName: 'Importe',
        valueGetter: (params) => params.data.quantity * params.data.unitPrice,
        valueFormatter: (params) => params.value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
      }
    ],
    []
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Oferta económica</h2>
      <p className="text-sm text-slate-500">Pega desde Excel (Ctrl+V) directamente en la tabla para actualizar tus precios.</p>
      <div className="ag-theme-quartz" style={{ height: 400 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          enableRangeSelection
          enableFillHandle
          clipboardPasteOperation={(params) => params.data}
        />
      </div>
      <div className="rounded-md bg-white p-4 shadow">
        <p className="text-right text-lg font-semibold">
          Total ofertado:{' '}
          {rowData
            .reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)
            .toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    </div>
  );
}
