// frontend/src/components/Modal.tsx
import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  tables: string[];
  onClose: () => void;
  onToast: (msg: string) => void;
};

type Column = {
  column_name: string;
  data_type: string;
};

const Modal: React.FC<Props> = ({ title, tables, onClose, onToast }) => {
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    if (selectedTable) {
      fetch(`http://localhost:4000/api/meta/columns?table=${selectedTable}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setColumns(data);
          } else {
            onToast("Erro ao carregar colunas da tabela.");
          }
        })
        .catch(() => onToast("Erro ao buscar colunas."));
    }
  }, [selectedTable]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>
        </div>

        {/* Select de tabelas */}
        {tables.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Escolha a tabela:
            </label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              {tables.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Colunas da tabela */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
          {columns.map((col) => (
            <div
              key={col.column_name}
              className="bg-gray-100 p-2 rounded text-center text-sm font-mono"
            >
              {col.column_name}
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
